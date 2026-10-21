import { ref } from 'vue'
import { orderService } from '@/services/order.service'
import type { ApiError, Order, OrderStatus } from '@/types'

/** Una orden pending más joven que esto todavía puede confirmarse sola. */
const PENDING_WINDOW_MS = 10 * 60 * 1000

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  pending: { label: 'Pendiente', tone: 'warning' },
  paid: { label: 'Pagada', tone: 'success' },
  canceled: { label: 'Cancelada', tone: 'muted' },
  failed: { label: 'Fallida', tone: 'danger' },
}

export function useMyOrders() {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref('')
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)

  async function load(target = 1) {
    loading.value = true
    error.value = ''
    try {
      const data = await orderService.listMine(target)
      orders.value = data.items
      page.value = data.page
      pages.value = data.pages
      total.value = data.total
    } catch (err) {
      error.value = (err as ApiError).message || 'No se pudieron cargar tus pedidos'
    } finally {
      loading.value = false
    }
  }

  /** Pago recién hecho que Payphone/el backend aún puede estar cerrando. */
  function isProcessing(order: Order): boolean {
    if (order.status !== 'pending') return false
    return Date.now() - new Date(order.createdAt).getTime() < PENDING_WINDOW_MS
  }

  return { orders, loading, error, page, pages, total, load, isProcessing }
}
