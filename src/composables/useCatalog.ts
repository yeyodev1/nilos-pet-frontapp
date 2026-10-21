import { onMounted, ref, watch } from 'vue'
import { catalogService } from '@/services/catalog.service'
import type { ApiError, Category, Product } from '@/types'

const PAGE_SIZE = 12

/**
 * Estado del catálogo público: categorías, búsqueda con debounce,
 * filtro por categoría y paginación. La vista solo pinta.
 */
export function useCatalog(initial: { search?: string; category?: string } = {}) {
  const categories = ref<Category[]>([])
  const products = ref<Product[]>([])
  const loading = ref(true)
  const error = ref('')
  const search = ref(initial.search || '')
  const category = ref(initial.category || '')
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)

  // Si llega una respuesta vieja después de una nueva, se descarta.
  let requestId = 0

  async function fetchProducts() {
    const id = ++requestId
    loading.value = true
    error.value = ''
    try {
      const data = await catalogService.listProducts({
        search: search.value.trim() || undefined,
        category: category.value || undefined,
        page: page.value,
        limit: PAGE_SIZE,
      })
      if (id !== requestId) return
      products.value = data.items
      pages.value = Math.max(1, data.pages)
      total.value = data.total
    } catch (e) {
      if (id !== requestId) return
      products.value = []
      pages.value = 1
      total.value = 0
      error.value = (e as ApiError).message
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      categories.value = await catalogService.getCategories()
    } catch {
      // Sin categorías el filtro simplemente no se muestra.
      categories.value = []
    }
  }

  /** Cambiar un filtro reinicia la página sin disparar dos peticiones. */
  function refetchFromStart() {
    if (page.value !== 1) {
      page.value = 1
    } else {
      fetchProducts()
    }
  }

  let debounceId: ReturnType<typeof setTimeout> | undefined
  watch(search, () => {
    clearTimeout(debounceId)
    debounceId = setTimeout(refetchFromStart, 350)
  })
  watch(category, refetchFromStart)
  watch(page, fetchProducts)

  onMounted(() => {
    fetchCategories()
    fetchProducts()
  })

  return {
    categories,
    products,
    loading,
    error,
    search,
    category,
    page,
    pages,
    total,
    reload: fetchProducts,
  }
}
