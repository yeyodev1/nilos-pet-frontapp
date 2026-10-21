import type { BookingStatus, OrderStatus } from '@/types'

export type PillTone = 'success' | 'warning' | 'info' | 'danger' | 'muted'

interface StatusMeta {
  label: string
  tone: PillTone
}

// Los estados viajan en inglés por el API; el dueño los ve en español.
export const orderStatusMeta: Record<OrderStatus, StatusMeta> = {
  pending: { label: 'Pendiente', tone: 'warning' },
  paid: { label: 'Pagada', tone: 'success' },
  canceled: { label: 'Cancelada', tone: 'muted' },
  failed: { label: 'Fallida', tone: 'danger' },
}

export const bookingStatusMeta: Record<BookingStatus, StatusMeta> = {
  pending: { label: 'Pendiente', tone: 'warning' },
  confirmed: { label: 'Confirmada', tone: 'info' },
  done: { label: 'Realizada', tone: 'success' },
  canceled: { label: 'Cancelada', tone: 'muted' },
}

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Fecha con hora, para reservas y órdenes (formatDate solo trae el día). */
export function formatDateTime(value: string | Date): string {
  return dateTime.format(typeof value === 'string' ? new Date(value) : value)
}
