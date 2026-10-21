import { computed, reactive, ref, watch, type Ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product, ProductImage, ProductType } from '@/types'

/**
 * Estado del modal de crear/editar producto: formulario, conversión
 * dólares ↔ centavos y el ciclo de imágenes (preview local → subir → borrar).
 * Tras crear, el modal queda en modo edición para subir imágenes de una vez.
 */
export function useAdminProductForm(
  open: Ref<boolean>,
  source: Ref<Product | null>,
  emitSaved: () => void,
) {
  const toastStore = useToastStore()

  const current = ref<Product | null>(null) as Ref<Product | null>
  const saving = ref(false)
  const uploading = ref(false)

  const form = reactive({
    name: '',
    type: 'physical' as ProductType,
    category: '',
    /** En dólares, como lo escribe el dueño. */
    price: '',
    description: '',
    bookable: false,
    isPublished: false,
    isFeatured: false,
  })

  function fill(product: Product | null) {
    current.value = product
    form.name = product?.name || ''
    form.type = product?.type || 'physical'
    form.category =
      product?.category && typeof product.category === 'object'
        ? product.category._id
        : product?.category || ''
    form.price = product && product.price > 0 ? (product.price / 100).toFixed(2) : ''
    form.description = product?.description || ''
    form.bookable = product?.bookable || false
    form.isPublished = product?.isPublished || false
    form.isFeatured = product?.isFeatured || false
    clearFile()
  }

  watch(open, (isOpen) => {
    if (isOpen) fill(source.value)
    else clearFile()
  })

  const isEdit = computed(() => current.value !== null)
  const images = computed<ProductImage[]>(() => current.value?.images || [])

  /** '12,50' o '12.50' → centavos; vacío = 0 (sin precio); inválido = null. */
  function parsePrice(): number | null {
    const raw = form.price.trim().replace(',', '.')
    if (raw === '') return 0
    const dollars = Number(raw)
    if (!Number.isFinite(dollars) || dollars < 0) return null
    return Math.round(dollars * 100)
  }

  async function save() {
    if (!form.name.trim()) {
      toastStore.error('El nombre es obligatorio')
      return
    }
    const cents = parsePrice()
    if (cents === null) {
      toastStore.error('El precio no es válido')
      return
    }

    saving.value = true
    try {
      const base = {
        name: form.name.trim(),
        type: form.type,
        category: form.category || undefined,
        price: cents,
        description: form.description.trim(),
        bookable: form.type === 'service' && form.bookable,
      }
      if (current.value) {
        await adminService.updateProduct(current.value._id, {
          ...base,
          isPublished: form.isPublished,
          isFeatured: form.isFeatured,
        })
        toastStore.success('Producto guardado')
        emitSaved()
        return true
      }
      const created = await adminService.createProduct(base)
      current.value = created
      toastStore.success('Producto creado: ahora puedes subirle imágenes')
      emitSaved()
      return false // el modal se queda abierto, ya en modo edición
    } catch (e) {
      toastStore.error((e as ApiError).message)
      return false
    } finally {
      saving.value = false
    }
  }

  // ─── Imágenes ──────────────────────────────────────────────────────────

  const pendingFile = ref<File | null>(null)
  const previewUrl = ref('')

  function pickFile(file: File | null) {
    clearFile()
    if (!file) return
    pendingFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }

  function clearFile() {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
    pendingFile.value = null
  }

  function applyImages(updated: Partial<Product>, fallback: ProductImage[]) {
    if (!current.value) return
    const images = Array.isArray(updated.images) ? updated.images : fallback
    current.value = { ...current.value, images }
  }

  async function uploadImage() {
    if (!current.value || !pendingFile.value) return
    uploading.value = true
    try {
      const updated = await adminService.uploadProductImage(current.value._id, pendingFile.value)
      applyImages(updated, current.value.images)
      clearFile()
      toastStore.success('Imagen subida')
      emitSaved()
    } catch (e) {
      toastStore.error((e as ApiError).message)
    } finally {
      uploading.value = false
    }
  }

  async function removeImage(publicId: string) {
    if (!current.value) return
    try {
      const updated = await adminService.deleteProductImage(current.value._id, publicId)
      applyImages(
        updated,
        current.value.images.filter((image) => image.publicId !== publicId),
      )
      toastStore.success('Imagen eliminada')
      emitSaved()
    } catch (e) {
      toastStore.error((e as ApiError).message)
    }
  }

  return {
    form,
    current,
    isEdit,
    images,
    saving,
    uploading,
    pendingFile,
    previewUrl,
    save,
    pickFile,
    clearFile,
    uploadImage,
    removeImage,
  }
}
