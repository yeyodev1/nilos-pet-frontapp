import APIBase from './httpBase'
import type { LastCustomer } from '@/utils/lastCustomer'

/** Busca la última compra o reserva con ese correo y celular para autollenar. */
class CustomerService extends APIBase {
  async lookup(email: string, phone: string): Promise<LastCustomer | null> {
    const { data } = await this.post<{ customer: LastCustomer | null }>('customers/lookup', {
      email,
      phone,
    })
    return data.customer
  }
}

export const customerService = new CustomerService()
