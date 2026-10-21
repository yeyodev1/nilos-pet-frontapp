import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useAdminList } from '@/composables/useAdminList'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Category, Product, ProductType } from '@/types'

/**
 * Toda la lógica de la vista de productos: filtros (con "sin precio" llegando
 * también por query desde el dashboard), edición inline de precio y toggles
 * sin modal, y el flujo de borrado. El modal de crear/editar vive aparte.
 */
export function useAdminProducts() {
  const route = useRoute()
  const toastStore = useToastStore()

  const categories = ref<Category[]>([])
  const search = ref('')
  const category = ref('')
  const type = ref<ProductType | ''>('')
  const published = ref('')
  // El trabajo nº 1 del dueño: 393 productos cargados sin precio.
  const unpriced = ref(route.query.priced === '0')

  const list = useAdminList<Product>(
    (page) =>
      adminService.listProducts({
        search: search.value.trim() || undefined,
        category: category.value || undefined,
        type: type.value || undefined,
        published: published.value || undefined,
        priced: unpriced.value ? '0' : undefined,
        page,
      }),
    { filters: [category, type, published, unpriced], debounced: [search] },
  )

  async function loadCategories() {
    try {
      categories.value = await adminService.listCategories()
    } catch {
      // Sin categorías el filtro simplemente no se muestra.
      categories.value = []
    }
  }

  function replaceItem(updated: Product) {
    const index = list.items.value.findIndex((p) => p._id === updated._id)
    if (index !== -1) list.items.value.splice(index, 1, { ...list.items.value[index], ...updated })
  }

  /** Guarda el precio editado inline. Recibe centavos ya convertidos. */
  async function savePrice(product: Product, cents: number) {
    try {
      const updated = await adminService.updateProduct(product._id, { price: cents })
      replaceItem(updated)
      toastStore.success(`Precio de «${product.name}» guardado`)
      // Con el filtro "sin precio" activo el producto ya no pertenece a la lista.
      if (unpriced.value && cents > 0) list.reload()
    } catch (e) {
      toastStore.error((e as ApiError).message)
    }
  }

  /** Publica/destaca con actualización optimista y reversa si el API falla. */
  async function toggleField(product: Product, field: 'isPublished' | 'isFeatured') {
    const next = !product[field]
    product[field] = next
    try {
      const updated = await adminService.updateProduct(product._id, { [field]: next })
      replaceItem(updated)
    } catch (e) {
      product[field] = !next
      toastStore.error((e as ApiError).message)
    }
  }

  const pendingDelete = ref<Product | null>(null) as Ref<Product | null>

  async function confirmDelete() {
    if (!pendingDelete.value) return
    try {
      await adminService.deleteProduct(pendingDelete.value._id)
      toastStore.success(`«${pendingDelete.value.name}» eliminado`)
      pendingDelete.value = null
      list.reload()
    } catch (e) {
      toastStore.error((e as ApiError).message)
    }
  }

  // Modal de creación/edición: la vista monta ProductModal con este estado.
  const modalOpen = ref(false)
  const editing = ref<Product | null>(null) as Ref<Product | null>

  function openCreate() {
    editing.value = null
    modalOpen.value = true
  }

  function openEdit(product: Product) {
    editing.value = product
    modalOpen.value = true
  }

  function closeModal() {
    modalOpen.value = false
    editing.value = null
  }

  onMounted(loadCategories)

  return {
    ...list,
    categories,
    search,
    category,
    type,
    published,
    unpriced,
    savePrice,
    toggleField,
    pendingDelete,
    confirmDelete,
    modalOpen,
    editing,
    openCreate,
    openEdit,
    closeModal,
  }
}
