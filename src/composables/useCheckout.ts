import { computed, nextTick, reactive, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { orderService } from '@/services/order.service'
import { usePayphoneBox } from '@/composables/usePayphoneBox'
import type { ApiError, Order, OrderItemInput } from '@/types'

export type CheckoutStep = 'form' | 'creating' | 'box'

/** La Cajita vence a los 10 minutos: pasado eso se crea una orden nueva. */
const BOX_LIFETIME_MS = 10 * 60 * 1000

// Estado de módulo: lo comparten CheckoutView y CheckoutForm.
const form = reactive({ name: '', email: '', phone: '', documentId: '' })
const errors = reactive({ name: '', email: '', phone: '', documentId: '' })
const step = ref<CheckoutStep>('form')
const expired = ref(false)
const order = ref<Order | null>(null)
let expiryTimer: number | undefined

export function useCheckout() {
  const cart = useCartStore()
  const userStore = useUserStore()
  const toast = useToastStore()
  const payphone = usePayphoneBox()

  // Prefill con la sesión: si hay token pero el usuario aún no se restauró,
  // se intenta en segundo plano sin bloquear el formulario.
  function prefill() {
    const apply = (user: { name: string; email: string; phone: string } | null) => {
      if (!user) return
      if (!form.name) form.name = user.name
      if (!form.email) form.email = user.email
      if (!form.phone) form.phone = user.phone || ''
    }

    if (userStore.user) apply(userStore.user)
    else if (userStore.hasToken) userStore.restore().then(apply)
  }
  prefill()

  /** Líneas sin precio asignado: el backend las rechaza, mejor avisar antes. */
  const unbuyable = computed(() => cart.lines.filter((line) => line.price <= 0))
  const canPay = computed(() => !cart.isEmpty && unbuyable.value.length === 0)

  function validate(): boolean {
    errors.name = form.name.trim().length >= 3 ? '' : 'Escribe tu nombre completo'
    errors.email = /^\S+@\S+\.\S+$/.test(form.email.trim()) ? '' : 'Escribe un correo válido'
    errors.phone = /^\+?\d{9,13}$/.test(form.phone.replace(/[\s-]/g, ''))
      ? ''
      : 'Escribe un teléfono válido, ej. 0991234567'
    errors.documentId = /^\d{10}(\d{3})?$/.test(form.documentId.trim())
      ? ''
      : 'La cédula debe tener 10 dígitos'
    return !errors.name && !errors.email && !errors.phone && !errors.documentId
  }

  function startExpiryTimer() {
    window.clearTimeout(expiryTimer)
    expiryTimer = window.setTimeout(() => {
      expired.value = true
    }, BOX_LIFETIME_MS)
  }

  async function submit() {
    if (!canPay.value || !validate()) return

    step.value = 'creating'
    expired.value = false

    try {
      const items: OrderItemInput[] = cart.lines.map((line) => ({
        productId: line.productId,
        qty: line.qty,
        ...(line.branchId ? { branchId: line.branchId, scheduledFor: line.scheduledFor } : {}),
      }))

      const { order: created, cajita } = await orderService.createOrder({
        items,
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          documentId: form.documentId.trim(),
        },
        fulfillment: 'pickup',
      })

      order.value = created
      step.value = 'box'
      // El div #pp-button recién existe cuando Vue pinta el paso "box".
      await nextTick()
      await payphone.mount(cajita, form.email.trim(), form.phone.trim(), form.documentId.trim())
      startExpiryTimer()
    } catch (error) {
      step.value = 'form'
      toast.error((error as ApiError).message || 'No se pudo iniciar el pago. Intenta de nuevo.')
    }
  }

  /** La Cajita expirada no se revive: se crea una orden nueva con otro clientTransactionId. */
  function retry() {
    order.value = null
    submit()
  }

  /** Al salir del checkout el flujo vuelve a cero; una Cajita vieja no sirve. */
  function dispose() {
    window.clearTimeout(expiryTimer)
    step.value = 'form'
    expired.value = false
    order.value = null
  }

  return { form, errors, step, expired, order, unbuyable, canPay, submit, retry, dispose }
}
