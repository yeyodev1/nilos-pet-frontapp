import { computed, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'

/**
 * "Volver" del detalle: regresa a donde estaba el cliente — servicios,
 * exámenes o la misma página de la tienda (que sigue viva con KeepAlive, con
 * su paginación y su scroll).
 */
export function useBackLink(product: Ref<Product | null>) {
  const router = useRouter()

  const backTo = computed(() => {
    if (product.value?.type === 'service') return { to: '/servicios', label: 'Volver a servicios' }
    if (product.value?.type === 'exam') return { to: '/examenes', label: 'Volver a exámenes' }
    return { to: '/tienda', label: 'Volver a la tienda' }
  })

  function goBack() {
    const previous = String(window.history.state?.back || '')
    if (previous.startsWith(backTo.value.to)) router.back()
    else router.push(backTo.value.to)
  }

  return { backTo, goBack }
}
