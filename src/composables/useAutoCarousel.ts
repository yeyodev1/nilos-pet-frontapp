import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { motionOk } from '@/composables/useGsapReveal'

/**
 * Carrusel sobre scroll nativo con snap: avanza una tarjeta cada `everyMs`,
 * vuelve al inicio al llegar al final y se detiene con hover, foco o el botón
 * de pausa. Con "reducir movimiento" arranca en pausa (WCAG 2.2.2).
 */
export function useAutoCarousel(track: Ref<HTMLElement | null>, everyMs = 3500) {
  const playing = ref(false)
  const hold = ref(false)
  let timer: number | undefined

  function step(): number {
    const el = track.value
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return 0
    return card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
  }

  function next() {
    const el = track.value
    if (!el) return
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    if (atEnd) el.scrollTo({ left: 0 })
    else el.scrollBy({ left: step() })
  }

  function prev() {
    const el = track.value
    if (!el) return
    if (el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth })
    else el.scrollBy({ left: -step() })
  }

  onMounted(() => {
    playing.value = motionOk()
    timer = window.setInterval(() => {
      if (playing.value && !hold.value && document.visibilityState === 'visible') next()
    }, everyMs)
  })

  onUnmounted(() => window.clearInterval(timer))

  return { playing, hold, next, prev }
}
