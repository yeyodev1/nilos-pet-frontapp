/** Copy de "Quiénes somos", tomado del documento que envió el cliente. */
export const about = {
  hero: {
    eyebrow: 'Conoce a Nilos Pet',
    titleParts: [
      { text: 'Amor, criterio profesional y ' },
      { text: 'transparencia', italic: true },
      { text: ' para quienes más amas' },
    ],
    text: 'Somos un centro de salud veterinaria integral en Guayaquil. Nacimos con la convicción de transformar la atención médica animal combinando conocimiento científico, instalaciones sin estrés y un trato familiar y honesto.',
    badge: {
      title: 'Atención paciente y respetuosa',
      text: 'Cuidamos el estado emocional de tu mascota en cada visita.',
    },
    stats: [
      { value: '100%', label: 'Grooming con vidrio visor' },
      { value: '0', label: 'Jaulas en el hospedaje' },
      { value: '2', label: 'Puntos de atención' },
    ],
  },
  history: {
    eyebrow: 'El origen de Nilos Pet',
    title: 'Un camino impulsado por el amor a los animales',
    paragraphs: [
      'Nilos Pet nació desde el corazón. Nuestro nombre es un homenaje a nuestra propia mascota, quien nos inspiró a dar el primer paso.',
      'A lo largo de los años entendimos que los tutores no solo buscan una atención médica de calidad, sino también la tranquilidad de saber exactamente cómo son tratados sus compañeros. Como médicos veterinarios, sabemos que ejercer la profesión implica mucho más que aplicar tratamientos: significa cuidar con ética, dedicación y, sobre todo, transparencia total.',
      'Por eso creamos Nilos Pet: un centro veterinario pensado para que te sientas parte de cada paso, con las puertas abiertas y el trato amoroso que tu mascota merece. ¡Porque aquí los cuidamos como si fueran nuestros!',
    ],
    quote:
      'Nuestra promesa sigue intacta desde el primer día: tratar a cada paciente con el mismo nivel de cuidado, respeto y paciencia con el que cuidamos a nuestras propias mascotas.',
  },
  purpose: {
    eyebrow: 'Nuestro propósito',
    title: 'Misión y visión que nos guían',
    tabs: [
      {
        label: 'Nuestra misión',
        lead: 'Lo que hacemos cada día',
        text: 'Brindar atención médica veterinaria integral, grooming responsable y hospedaje familiar en Guayaquil, combinando rigor científico, tecnología adaptada y una profunda empatía por las mascotas y sus familias. Nos comprometemos a garantizar diagnósticos transparentes y una experiencia sin estrés para cada mascota.',
      },
      {
        label: 'Nuestra visión',
        lead: 'Hacia dónde vamos',
        text: 'Ser reconocidos como el centro de bienestar veterinario de referencia en Guayaquil, liderando un nuevo estándar de atención basada en la absoluta transparencia, el hospedaje familiar ético y la constante actualización médica, construyendo una comunidad de tutores informados y tranquilos.',
      },
    ],
  },
  principles: {
    eyebrow: 'Principios innegociables',
    title: 'Los valores que definen nuestra atención',
    text: 'En Nilos Pet no solo tratamos síntomas; cuidamos pacientes y acompañamos a sus familias.',
    items: [
      {
        icon: 'fa-solid fa-heart',
        title: 'Empatía y bienestar',
        text: 'Priorizamos el confort físico y emocional. Adaptamos nuestros tiempos a la personalidad de cada mascota para minimizar el miedo.',
      },
      {
        icon: 'fa-solid fa-eye',
        title: 'Transparencia total',
        text: 'Sin secretos. Grooming con ventanal abierto, diagnósticos explicados en lenguaje claro y presupuesto sin sorpresas.',
      },
      {
        icon: 'fa-solid fa-stethoscope',
        title: 'Responsabilidad y compromiso',
        text: 'Cumplir con los protocolos adecuados, asumir el cuidado con ética y garantizar que cada procedimiento, de una consulta a una cirugía o un grooming, se realice impecablemente.',
      },
      {
        icon: 'fa-solid fa-graduation-cap',
        title: 'Capacitación constante',
        text: 'Mantenernos actualizados en los avances médicos y en las mejores prácticas de la profesión de manera continua.',
      },
    ],
  },
  differentials: {
    eyebrow: 'Lo que nos hace diferentes',
    title: 'Nuestros pilares en Guayaquil',
    text: 'Servicios diseñados pensando en el verdadero bienestar de tu compañero y en tu tranquilidad.',
    items: [
      {
        icon: 'fa-solid fa-shower',
        title: 'Grooming con vidrio visor',
        text: 'Puedes ver todo el proceso de baño y corte desde nuestra área de espera. Estética amable, sin jalones ni estrés.',
        tag: 'Transparencia e higiene visible',
      },
      {
        icon: 'fa-solid fa-house-chimney',
        title: 'Hospedaje libre de jaulas',
        text: 'Un entorno familiar y controlado con supervisión constante, juegos y reportes diarios a tu celular.',
        tag: 'Reportes continuos por WhatsApp',
      },
      {
        icon: 'fa-solid fa-truck-medical',
        title: 'Consulta y vacunas a domicilio',
        text: 'Llevamos la atención médica veterinaria directamente a tu hogar. Cobertura sujeta a disponibilidad.',
        tag: 'Ideal para mascotas nerviosas',
      },
      {
        icon: 'fa-solid fa-bowl-food',
        title: 'Nutrición y dieta BARF',
        text: 'Dieta BARF (pollo, res, pavo o cordero) y alimentos balanceados premium, super premium y medicados.',
        tag: 'Para paladares exigentes',
      },
      {
        icon: 'fa-solid fa-shield-heart',
        title: 'Medicina preventiva',
        text: 'Esquemas de vacunación, controles sanguíneos y cirugías electivas.',
        tag: 'Calendarios de salud al día',
      },
      {
        icon: 'fa-solid fa-map-location-dot',
        title: 'Ubicaciones estratégicas',
        text: 'Mucho Lote 1 y Urdesa Central: zonas de fácil acceso, con parqueo y ambiente tranquilo.',
        tag: 'Fácil acceso y parqueo',
      },
    ],
  },
  cta: {
    title: '¿Quieres agendar una consulta o conocer nuestras instalaciones?',
    text: 'Estamos listos para atenderte en Urdesa, en Mucho Lote 1 o para coordinar una visita a tu domicilio.',
  },
} as const
