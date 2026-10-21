// Fecha + hora para reservas. formatMoney/formatDate viven en format.ts;
// esto va aparte porque las reservas necesitan también la hora.
const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function formatDateTime(value: string | Date): string {
  const parsed = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(parsed.getTime())) return ''
  return dateTime.format(parsed)
}
