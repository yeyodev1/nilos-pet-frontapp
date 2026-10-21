import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Si la persona pidió menos movimiento, no animamos nada: el contenido ya es
 * visible porque los estados iniciales solo los aplica GSAP (gsap.from).
 * Sin JS o sin motion, la página queda completa — nunca invisible.
 */
export function motionOk(): boolean {
  return (
    typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Tras cargar datos async cambia el alto de la página: recalcular triggers. */
export function refreshTriggers(): void {
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

/**
 * Animación declarativa dentro de un root:
 * - [data-reveal]            → fade + rise al entrar al viewport (una sola vez)
 * - [data-reveal-delay="n"]  → retraso en segundos (para staggers manuales)
 * - [data-parallax="speed"]  → desplazamiento vertical suave ligado al scroll
 * - [data-float]             → vaivén infinito (huellas, arcos decorativos)
 * - [data-count="399"]       → contador que sube hasta el número al entrar
 * El callback `extra` corre dentro del mismo gsap.context para timelines
 * propios del componente (p. ej. la entrada del hero).
 */
export function useGsapReveal(
  root: Ref<HTMLElement | null>,
  extra?: () => void,
): { init: () => void; refresh: () => void } {
  let ctx: gsap.Context | undefined
  let initialized = false

  // Secciones con v-if sobre datos async montan su DOM después del fetch:
  // ahí el componente llama init() a mano (tras nextTick).
  function init(): void {
    if (initialized || !root.value || !motionOk()) return
    initialized = true

    ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 28,
          duration: 0.85,
          ease: 'power3.out',
          delay: Number(el.dataset.revealDelay || 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = Number(el.dataset.parallax || 0.15)
        gsap.to(el, {
          y: () => -speed * 260,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el, i) => {
        gsap.to(el, {
          y: -12,
          rotation: '+=5',
          duration: 2.6 + i * 0.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.35,
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count || 0)
        const suffix = el.dataset.countSuffix || ''
        const state = { value: 0 }
        gsap.to(state, {
          value: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(state.value)}${suffix}`
          },
        })
      })

      extra?.()
    }, root.value)
  }

  onMounted(init)
  onBeforeUnmount(() => ctx?.revert())

  return { init, refresh: refreshTriggers }
}

export { gsap }
