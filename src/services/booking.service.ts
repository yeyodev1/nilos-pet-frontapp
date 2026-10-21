import APIBase from './httpBase'
import type { Booking, CreateBookingInput } from '@/types'

/** Reservas de servicios sin pago: el local confirma por teléfono o correo. */
class BookingService extends APIBase {
  async create(input: CreateBookingInput): Promise<Booking> {
    const { data } = await this.post<Booking>('bookings', input)
    return data
  }
}

export const bookingService = new BookingService()
