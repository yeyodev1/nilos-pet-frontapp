// Recuerda en este navegador los datos del último cliente y su mascota para no
// pedirlos de nuevo en cada reserva o compra. Sin storage, simplemente no recuerda.
const KEY = 'nilos:cliente'

export interface LastCustomer {
  name?: string
  email?: string
  phone?: string
  documentId?: string
  pet?: { name: string; species: string; breed: string }
}

export function loadLastCustomer(): LastCustomer {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as LastCustomer
  } catch {
    return {}
  }
}

/** Mezcla con lo ya guardado: una compra no borra la mascota de una reserva. */
export function saveLastCustomer(data: LastCustomer): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...loadLastCustomer(), ...data }))
  } catch {
    // Modo privado o storage bloqueado: no pasa nada.
  }
}
