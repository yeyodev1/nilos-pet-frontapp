import APIBase from './httpBase'
import type { CreateOrderInput, CreateOrderResponse, Order, Paginated } from '@/types'

/**
 * Órdenes y pago con la Cajita de Payphone.
 * createOrder devuelve la orden pending + la configuración para montar la Cajita;
 * confirmOrder es idempotente: el backend consulta a Payphone y fija el estado.
 */
class OrderService extends APIBase {
  async createOrder(input: CreateOrderInput): Promise<CreateOrderResponse> {
    const { data } = await this.post<CreateOrderResponse>('orders', input)
    return data
  }

  async confirmOrder(id: string, clientTransactionId: string): Promise<Order> {
    const { data } = await this.post<Order>('orders/confirm', { id, clientTransactionId })
    return data
  }

  async listMine(page = 1): Promise<Paginated<Order>> {
    const { data } = await this.get<Paginated<Order>>(`orders/mine?page=${page}`)
    return data
  }
}

export const orderService = new OrderService()
