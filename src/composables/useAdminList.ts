import { onMounted, ref, watch, type Ref, type WatchSource } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Paginated } from '@/types'

interface UseAdminListOptions {
  /** Filtros que al cambiar vuelven a la página 1 (selects, chips). */
  filters?: WatchSource[]
  /** Filtros con debounce (campos de búsqueda). */
  debounced?: WatchSource[]
  debounceMs?: number
}

/**
 * Patrón de toda lista del admin: página, total, loading, error con toast
 * y refetch al cambiar filtros. La vista solo arma el fetcher y pinta.
 */
export function useAdminList<T>(
  fetchPage: (page: number) => Promise<Paginated<T>>,
  options: UseAdminListOptions = {},
) {
  const { filters = [], debounced = [], debounceMs = 350 } = options
  const toastStore = useToastStore()

  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(true)
  const error = ref('')
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)

  // Si llega una respuesta vieja después de una nueva, se descarta.
  let requestId = 0

  async function reload() {
    const id = ++requestId
    loading.value = true
    error.value = ''
    try {
      const data = await fetchPage(page.value)
      if (id !== requestId) return
      items.value = data.items
      pages.value = Math.max(1, data.pages)
      total.value = data.total
    } catch (e) {
      if (id !== requestId) return
      items.value = []
      pages.value = 1
      total.value = 0
      error.value = (e as ApiError).message
      toastStore.error(error.value)
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  /** Cambiar un filtro reinicia la página sin disparar dos peticiones. */
  function refetchFromStart() {
    if (page.value !== 1) {
      page.value = 1
    } else {
      reload()
    }
  }

  if (filters.length) watch(filters, refetchFromStart)

  let debounceId: ReturnType<typeof setTimeout> | undefined
  if (debounced.length) {
    watch(debounced, () => {
      clearTimeout(debounceId)
      debounceId = setTimeout(refetchFromStart, debounceMs)
    })
  }

  watch(page, reload)
  onMounted(reload)

  return { items, loading, error, page, pages, total, reload, refetchFromStart }
}
