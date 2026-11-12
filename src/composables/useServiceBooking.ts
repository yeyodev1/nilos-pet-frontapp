import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { whatsappLink } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { bookingService } from '@/services/booking.service'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import { canPayOnline } from '@/utils/catalog'
import type { ApiError, Branch, Product } from '@/types'

/** Solo fecha: la hora la confirma la sucursal. Mediodía de Guayaquil evita saltos de día. */
const toIso = (day: string) => `${day}T12:00:00-05:00`

/**
 * Reserva de uno o varios servicios/exámenes en una sucursal, con tres salidas
 * según lo que permita cada uno: pagar en línea (carrito), solo reservar
 * (POST /bookings) o consultar por WhatsApp a la sucursal elegida.
 */
export function useServiceBooking(getProducts: () => Product[], onDone: () => void = () => {}) {
  const router = useRouter()
  const cartStore = useCartStore()
  const toast = useToastStore()
  const userStore = useUserStore()

  const branches = ref<Branch[]>([])
  const loadingBranches = ref(true)
  const branchId = ref('')
  const date = ref('')
  const endDate = ref('')
  const sending = ref(false)

  const user = userStore.user
  const customer = reactive({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const pet = reactive({
    name: user?.pet?.name || '',
    species: user?.pet?.species || '',
    breed: user?.pet?.breed || '',
  })

  // La cita más próxima posible: mañana.
  const minDate = new Date(Date.now() + 86_400_000).toLocaleDateString('en-CA')

  const bookable = computed(() => getProducts().every((p) => p.bookable))
  const payable = computed(() => bookable.value && getProducts().every(canPayOnline))
  const dateRange = computed(() => getProducts().some((p) => p.dateRange))
  const names = computed(() =>
    getProducts()
      .map((p) => p.name)
      .join(', '),
  )

  const selectedBranch = computed(
    () => branches.value.find((b) => b._id === branchId.value) || null,
  )
  const datesReady = computed(
    () => date.value >= minDate && (!dateRange.value || endDate.value >= date.value),
  )
  const ready = computed(() => Boolean(selectedBranch.value) && datesReady.value)

  const whatsappUrl = computed(() =>
    whatsappLink(
      `Hola, quiero información sobre: ${names.value} (${selectedBranch.value?.name || ''})`,
      selectedBranch.value?.phone,
    ),
  )

  onMounted(async () => {
    try {
      branches.value = await catalogService.getBranches()
    } catch {
      branches.value = []
    } finally {
      loadingBranches.value = false
    }
  })

  /** Pago en línea: la reserva se crea sola cuando Payphone aprueba el pago. */
  function pay() {
    const branch = selectedBranch.value
    if (!branch || !ready.value) return
    for (const product of getProducts()) {
      cartStore.add(product, {
        branchId: branch._id,
        branchName: branch.name,
        scheduledFor: toIso(date.value),
      })
    }
    toast.success('Reserva agregada al carrito')
    onDone()
    router.push('/carrito')
  }

  function missingData(): string {
    if (customer.name.trim().split(/\s+/).length < 2) return 'Escribe tu nombre y apellido'
    if (customer.phone.replace(/\D/g, '').length < 7) return 'Escribe un teléfono válido'
    if (!pet.name.trim() || !pet.species || !pet.breed.trim()) {
      return 'Completa el nombre, la especie y la raza de tu mascota'
    }
    return ''
  }

  async function book() {
    if (!ready.value || sending.value) return
    const missing = missingData()
    if (missing) {
      toast.error(missing)
      return
    }
    sending.value = true
    try {
      for (const product of getProducts()) {
        await bookingService.create({
          productId: product._id,
          branchId: branchId.value,
          customer: {
            name: customer.name.trim(),
            email: customer.email.trim(),
            phone: customer.phone.trim(),
          },
          pet: { name: pet.name.trim(), species: pet.species, breed: pet.breed.trim() },
          preferredAt: toIso(date.value),
          ...(dateRange.value ? { preferredEnd: toIso(endDate.value) } : {}),
        })
      }
      toast.success('Reserva enviada. Te contactaremos para confirmar la cita.')
      onDone()
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
    date,
    endDate,
    minDate,
    customer,
    pet,
    bookable,
    payable,
    dateRange,
    selectedBranch,
    ready,
    sending,
    whatsappUrl,
    pay,
    book,
  }
}
