import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import { bookingService } from '@/services/booking.service'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Branch, Product } from '@/types'

function toLocalInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const fecha = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return `${fecha}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * Lógica de reserva de un servicio: sucursal + fecha preferida, con dos
 * salidas — pagar en línea (carrito) o solo reservar (POST /bookings).
 */
export function useServiceBooking(getProduct: () => Product) {
  const router = useRouter()
  const cartStore = useCartStore()
  const toast = useToastStore()

  const branches = ref<Branch[]>([])
  const loadingBranches = ref(true)
  const branchId = ref('')
  const scheduledFor = ref('')

  // La cita más próxima posible: mañana a las 09:00.
  const minAt = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(9, 0, 0, 0)
    return toLocalInput(d)
  })()

  const selectedBranch = computed(
    () => branches.value.find((b) => b._id === branchId.value) || null,
  )
  const ready = computed(() =>
    Boolean(selectedBranch.value && scheduledFor.value && scheduledFor.value >= minAt),
  )

  onMounted(async () => {
    try {
      branches.value = (await catalogService.getBranches()).filter((b) => b.isActive)
      if (branches.value.length === 1) branchId.value = branches.value[0]?._id || ''
    } catch {
      branches.value = []
    } finally {
      loadingBranches.value = false
    }
  })

  function addToCartAndPay() {
    const branch = selectedBranch.value
    if (!branch || !ready.value) return
    cartStore.add(getProduct(), {
      branchId: branch._id,
      branchName: branch.name,
      scheduledFor: scheduledFor.value,
    })
    toast.success('Reserva agregada al carrito')
    router.push('/carrito')
  }

  // ─── Solo reservar (sin pago) ─────────────────────────────────────────
  const modalOpen = ref(false)
  const sending = ref(false)
  const customer = ref({ name: '', email: '', phone: '' })

  const customerReady = computed(() => {
    const { name, email, phone } = customer.value
    return (
      name.trim().length >= 3 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
      phone.trim().replace(/\D/g, '').length >= 7
    )
  })

  async function submitBooking() {
    if (!ready.value || sending.value) return
    if (!customerReady.value) {
      toast.error('Completa tu nombre, correo y teléfono para enviar la reserva')
      return
    }
    sending.value = true
    try {
      await bookingService.create({
        productId: getProduct()._id,
        branchId: branchId.value,
        customer: {
          name: customer.value.name.trim(),
          email: customer.value.email.trim(),
          phone: customer.value.phone.trim(),
        },
        preferredAt: new Date(scheduledFor.value).toISOString(),
      })
      modalOpen.value = false
      customer.value = { name: '', email: '', phone: '' }
      toast.success('Reserva enviada. Te contactaremos para confirmar la cita.')
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      sending.value = false
    }
  }

  return {
    branches,
    loadingBranches,
    branchId,
    scheduledFor,
    minAt,
    selectedBranch,
    ready,
    addToCartAndPay,
    modalOpen,
    sending,
    customer,
    customerReady,
    submitBooking,
  }
}
