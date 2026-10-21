import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product } from '@/types'

/**
 * Selector de servicios estilo laboratorio: la clienta marca los que quiere,
 * ve el total de los que tienen precio y los manda todos al carrito.
 */
export function useServicesPicker() {
  const router = useRouter()
  const cartStore = useCartStore()
  const toast = useToastStore()

  const services = ref<Product[]>([])
  const loading = ref(true)
  const error = ref('')
  const selectedIds = ref<Set<string>>(new Set())

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const data = await catalogService.listProducts({ type: 'service', limit: 100 })
      services.value = data.items
    } catch (e) {
      error.value = (e as ApiError).message
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  function toggle(id: string) {
    const next = new Set(selectedIds.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedIds.value = next
  }

  function isSelected(id: string) {
    return selectedIds.value.has(id)
  }

  const selectedServices = computed(() =>
    services.value.filter((s) => selectedIds.value.has(s._id)),
  )

  /** Centavos: suma solo los servicios con precio asignado. */
  const totalCents = computed(() => selectedServices.value.reduce((sum, s) => sum + s.price, 0))

  const hasUnpricedSelected = computed(() => selectedServices.value.some((s) => s.price === 0))

  /** Sin precios cargados, la página pasa a modo informativo con "Solo reservar". */
  const infoMode = computed(
    () => services.value.length > 0 && services.value.every((s) => s.price === 0),
  )

  function addSelectionToCart() {
    if (selectedServices.value.length === 0) return
    for (const service of selectedServices.value) {
      cartStore.add(service)
    }
    toast.success('Servicios agregados al carrito')
    selectedIds.value = new Set()
    router.push('/carrito')
  }

  return {
    services,
    loading,
    error,
    reload: load,
    toggle,
    isSelected,
    selectedServices,
    totalCents,
    hasUnpricedSelected,
    infoMode,
    addSelectionToCart,
  }
}
