import { computed, onMounted, ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import { finalPrice, productCategory } from '@/utils/catalog'
import type { ApiError, Product, ProductType } from '@/types'

/**
 * Lista de servicios o de exámenes con filtro por grupo (la categoría) y,
 * para exámenes, selección múltiple estilo laboratorio con su total.
 */
export function useServicesPicker(type: ProductType, groupSlugs: readonly string[]) {
  const items = ref<Product[]>([])
  const loading = ref(true)
  const error = ref('')
  const group = ref('')
  const selectedIds = ref<Set<string>>(new Set())

  async function load() {
    loading.value = true
    error.value = ''
    try {
      items.value = (await catalogService.listProducts({ type, limit: 100 })).items
    } catch (e) {
      error.value = (e as ApiError).message
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  /** Grupos en el orden de site.ts, solo los que tienen algo publicado. */
  const groups = computed(() =>
    groupSlugs
      .map((slug) => items.value.map(productCategory).find((cat) => cat?.slug === slug))
      .filter((cat) => cat !== undefined && cat !== null),
  )

  const visible = computed(() =>
    group.value
      ? items.value.filter((item) => productCategory(item)?.slug === group.value)
      : items.value,
  )

  function toggle(id: string) {
    const next = new Set(selectedIds.value)
    if (!next.delete(id)) next.add(id)
    selectedIds.value = next
  }

  const selected = computed(() => items.value.filter((s) => selectedIds.value.has(s._id)))
  /** Centavos: suma solo lo que tiene precio. */
  const totalCents = computed(() => selected.value.reduce((sum, s) => sum + finalPrice(s), 0))
  const hasUnpriced = computed(() => selected.value.some((s) => s.price === 0))

  function clear() {
    selectedIds.value = new Set()
  }

  return {
    loading,
    error,
    reload: load,
    group,
    groups,
    visible,
    toggle,
    selectedIds,
    selected,
    totalCents,
    hasUnpriced,
    clear,
  }
}
