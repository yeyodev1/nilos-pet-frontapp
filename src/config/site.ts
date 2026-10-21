/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 */
export const site = {
  name: 'Nilos Pet',
  wordmark: 'Nilos Pet',
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
    eyebrow: 'Veterinaria y tienda en línea',
    // Las partes en cursiva son el acento tipográfico de la marca.
    titleParts: [
      { text: 'Todo para que tu mascota viva ' },
      { text: 'feliz', italic: true },
      { text: ' y ' },
      { text: 'sana', italic: true },
    ],
    title: 'Todo para que tu mascota viva feliz y sana',
    subtitle:
      'Alimento, medicinas, accesorios y servicios veterinarios con reserva por sucursal. Pagas en línea con tarjeta y recoges sin filas.',
    ctaPrimary: 'Ver la tienda',
    ctaSecondary: 'Consultar resultados',
    stats: [
      { value: 399, suffix: '+', label: 'productos' },
      { value: 14, suffix: '', label: 'categorías' },
      { value: 2, suffix: '', label: 'sucursales' },
    ],
    stickerTop: '¡Hola!',
    stickerBottom: 'soy Nilos',
  },
  // La cinta inclinada: una frase corta por vuelta, el resto son categorías reales.
  marquee: [
    'Alimento para perros',
    'Alimento para gatos',
    'Snacks',
    'Medicamentos',
    'Desparasitantes',
    'Vitaminas y suplementos',
    'Higiene y cosmética',
    'Juguetes',
    'Camas y descanso',
    'Accesorios',
    'Hogar y control de plagas',
    'Servicios veterinarios',
  ],
  categoriesSection: {
    eyebrow: 'Explora por categoría',
    titleParts: [
      { text: 'De la ' },
      { text: 'croqueta', italic: true },
      { text: ' al ' },
      { text: 'chequeo', italic: true },
    ],
    cta: 'Ver todo en la tienda',
  },
  howItWorks: {
    eyebrow: '¿Cómo funciona?',
    titleParts: [{ text: 'Pedir es ' }, { text: 'facilísimo', italic: true }],
    steps: [
      {
        icon: 'fa-solid fa-magnifying-glass',
        title: 'Explora el catálogo',
        text: 'Casi 400 productos y servicios en 14 categorías, con búsqueda por nombre.',
      },
      {
        icon: 'fa-solid fa-basket-shopping',
        title: 'Arma tu pedido o reserva',
        text: 'Agrega al carrito, o agenda el servicio en la sucursal que prefieras.',
      },
      {
        icon: 'fa-solid fa-credit-card',
        title: 'Paga con tarjeta',
        text: 'Pago seguro en línea a través de Payphone. No guardamos tus datos.',
      },
      {
        icon: 'fa-solid fa-store',
        title: 'Retira en tu sucursal',
        text: 'Te avisamos cuando esté listo y pasas a recogerlo sin filas.',
      },
    ],
  },
  featuredSection: {
    eyebrow: 'Destacados',
    titleParts: [{ text: 'Los ' }, { text: 'favoritos', italic: true }, { text: ' de la casa' }],
    cta: 'Ver toda la tienda',
  },
  servicesBand: {
    eyebrow: 'Servicios veterinarios',
    titleParts: [
      { text: 'Chequeos, vacunas y ' },
      { text: 'mimos', italic: true },
      { text: ' con reserva' },
    ],
    text: 'Exámenes médicos, radiografías, peluquería y vacunación. Eliges el servicio, reservas en tu sucursal y pagas en línea o en el local.',
    cta: 'Reservar un servicio',
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
  catalog: {
    eyebrow: 'La tienda',
    titleParts: [{ text: 'Todo para tu ' }, { text: 'mascota', italic: true }],
    searchPlaceholder: 'Busca alimento, medicinas, accesorios…',
  },
  examResults: {
    title: 'Resultados de exámenes',
    subtitle: 'Escribe la cédula con la que registraste a tu mascota y descarga sus resultados.',
    placeholder: 'Número de cédula',
    empty: 'No encontramos resultados para esa cédula. Si crees que es un error, contáctanos.',
  },
  resultsBand: {
    titleParts: [{ text: 'Sus exámenes, ' }, { text: 'sin salir de casa', italic: true }],
    text: 'Escribe tu número de cédula y descarga los resultados de los exámenes de tu mascota en segundos.',
  },
  finalCta: {
    titleParts: [{ text: 'Tu mascota ya tiene ' }, { text: 'veterinaria favorita', italic: true }],
    ctaSecondary: 'Ver servicios',
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
