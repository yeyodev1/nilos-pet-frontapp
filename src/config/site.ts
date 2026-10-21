/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 */
export const site = {
  name: 'Nilos Pet',
  tagline: 'Servicios veterinarios y todo para tu mascota',
  description:
    'Nilos Pet — veterinaria con tienda en línea: alimento, medicinas y accesorios, exámenes médicos con resultados en línea y reservas por sucursal.',
  url: 'https://dev-nilos-pet-front.bakano.ec',
  email: '',
  // Solo dígitos con código de país, ej: 593984934039 (pendiente: confirmar con el cliente)
  whatsapp: '',
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Tienda', to: '/tienda' },
    { label: 'Servicios', to: '/servicios' },
    { label: 'Resultados', to: '/resultados' },
  ],
  hero: {
    eyebrow: 'Servicios veterinarios',
    title: 'El cuidado que tu mascota merece, ahora en línea',
    subtitle:
      'Compra alimento, medicinas y accesorios, agenda servicios en tu sucursal más cercana y revisa los resultados de exámenes desde casa.',
    ctaPrimary: 'Ver la tienda',
    ctaSecondary: 'Consultar resultados',
  },
  pillars: [
    {
      icon: 'fa-solid fa-basket-shopping',
      title: 'Tienda en línea',
      text: 'Alimento, medicinas, accesorios y más, con pago seguro con tarjeta a través de Payphone.',
    },
    {
      icon: 'fa-solid fa-stethoscope',
      title: 'Servicios veterinarios',
      text: 'Exámenes médicos, radiografías, peluquería y vacunación con reserva en la sucursal que prefieras.',
    },
    {
      icon: 'fa-solid fa-file-waveform',
      title: 'Resultados en línea',
      text: 'Consulta los resultados de los exámenes de tu mascota con tu número de cédula, sin ir al local.',
    },
  ],
  examResults: {
    title: 'Resultados de exámenes',
    subtitle:
      'Escribe la cédula con la que registraste a tu mascota y descarga sus resultados.',
    placeholder: 'Número de cédula',
    empty: 'No encontramos resultados para esa cédula. Si crees que es un error, contáctanos.',
  },
  checkout: {
    title: 'Finalizar compra',
    payNote: 'Pago procesado de forma segura por Payphone. No guardamos los datos de tu tarjeta.',
  },
  footerNote: 'Nilos Pet — Servicios veterinarios.',
} as const

export function whatsappLink(message = 'Hola, quiero más información'): string {
  if (!site.whatsapp) return '#'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
