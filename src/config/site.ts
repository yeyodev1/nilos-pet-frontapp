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
  // WhatsApp de la matriz (Mucho Lote 1). Cada sucursal usa además el suyo.
  whatsapp: '593997357977',
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  nav: [
    { label: 'Inicio', to: '/' },
    {
      label: 'Quiénes somos',
      to: '/quienes-somos',
      children: [
        { label: 'Historia', to: '/quienes-somos#historia' },
        { label: 'Misión y visión', to: '/quienes-somos#mision' },
        { label: 'Principios y virtudes', to: '/quienes-somos#principios' },
        { label: 'Diferenciales', to: '/quienes-somos#diferenciales' },
      ],
    },
    { label: 'Tienda en línea', to: '/tienda' },
    { label: 'Servicios', to: '/servicios', highlight: true },
    {
      label: 'Exámenes',
      to: '/examenes',
      children: [
        { label: 'Pago en línea', to: '/examenes' },
        { label: 'Resultados', to: '/resultados' },
      ],
    },
    { label: 'Sucursales', to: '/sucursales' },
  ] as NavLink[],
  // Slugs de categoría: agrupan la página de servicios y la de exámenes, y por
  // eso no salen como filtro de la tienda.
  serviceGroups: ['estetica-y-spa', 'medicina-y-prevencion', 'urgencias-y-cuidados'],
  examGroups: ['pruebas-rapidas', 'examenes-de-sangre', 'imagenes'],
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
      { value: 390, suffix: '+', label: 'productos' },
      { value: 24, suffix: '', label: 'servicios' },
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
    text: 'Spa, consulta, vacunas, cirugía y hospedaje sin jaulas. Eliges el servicio, reservas en tu sucursal y pagas en línea o en el local.',
    cta: 'Ver todos los servicios',
    carousel: {
      label: 'Nuestros servicios',
      prev: 'Servicio anterior',
      next: 'Siguiente servicio',
      pause: 'Pausar el carrusel',
      play: 'Reanudar el carrusel',
      from: 'Desde',
      cta: 'Reservar',
    },
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
  servicesPage: {
    eyebrow: 'Servicios',
    title: '¿Qué necesita tu mascota hoy?',
    titleParts: [
      { text: '¿Qué necesita tu mascota ' },
      { text: 'hoy', italic: true },
      { text: '?' },
    ],
    sticker: 'reserva en línea',
    imageAlt: 'Veterinaria de Nilos Pet revisando a un cachorro en consulta',
    subtitle:
      'Servicios clínicos, de estética y prevención. Elige tu sucursal y reserva, paga en línea o escríbenos por WhatsApp, según el servicio.',
    all: 'Todos los servicios',
    flow: [
      { icon: 'fa-solid fa-list-check', label: 'Elige el servicio' },
      { icon: 'fa-solid fa-location-dot', label: 'Elige tu sucursal y fecha' },
      { icon: 'fa-solid fa-credit-card', label: 'Reserva, paga o consulta' },
    ],
  },
  branchesPage: {
    eyebrow: 'Servicios veterinarios',
    title: 'Nuestras sucursales',
    titleParts: [{ text: 'Nuestras ' }, { text: 'sucursales', italic: true }],
    sticker: 'te esperamos',
    imageAlt: 'Recepción de una sucursal de Nilos Pet con una clienta y su perro',
    subtitle: 'Elige tu local más cercano y contáctanos directamente por WhatsApp.',
    contact: 'Contáctanos',
    directions: 'Cómo llegar',
  },
  reviews: {
    eyebrow: 'Reseñas',
    titleParts: [
      { text: 'Lo que dicen las ' },
      { text: 'familias', italic: true },
      { text: ' Nilos' },
    ],
    empty: 'Sé la primera persona en contarnos cómo le fue a tu mascota.',
    formTitle: 'Cuéntanos tu experiencia',
    placeholder: '¿Cómo atendimos a tu mascota?',
    loginCta: 'Ingresa para dejar tu reseña',
    register: {
      consent:
        'Acepto el tratamiento de mis datos personales para gestionar mi cuenta, mis reservas y los resultados de mi mascota.',
    },
  },
  examsPage: {
    eyebrow: 'Exámenes',
    title: 'Arma la orden de exámenes',
    titleParts: [{ text: 'Arma la orden de ' }, { text: 'exámenes', italic: true }],
    sticker: 'resultados en línea',
    imageAlt: 'Laboratorio de Nilos Pet con muestras y microscopio',
    allSubgroups: 'Todos los subgrupos',
    subtitle:
      'Marca los exámenes que necesita tu mascota, elige sucursal y fecha para la toma de muestra y paga en línea. Los resultados se consultan después con tu cédula.',
    all: 'Todos',
    resultsCta: 'Consultar resultados',
    unpricedNote: 'Hay exámenes sin precio en línea: se reservan y se pagan en la sucursal.',
  },
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

export interface NavLink {
  label: string
  to: string
  /** Se pinta como píldora para que resalte en el menú. */
  highlight?: boolean
  children?: { label: string; to: string }[]
}

/** phone: el de una sucursal ("+593 99…"); sin él se usa el de la matriz. */
export function whatsappLink(message = 'Hola, quiero más información', phone = ''): string {
  const digits = phone.replace(/\D/g, '') || site.whatsapp
  if (!digits) return '#'
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
