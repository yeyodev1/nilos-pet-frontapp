import type { CajitaConfig } from '@/types'

/**
 * Carga única de los recursos de la Cajita de Payphone y montaje del
 * formulario. Los recursos se inyectan la primera vez que alguien llega al
 * checkout — nunca en index.html — para no cargarlos en toda la web.
 */
const CSS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css'
const JS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js'

// Promesa de módulo: una sola carga por sesión, compartida entre llamadas.
let loader: Promise<void> | null = null

function injectResources() {
  if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = CSS_URL
    document.head.appendChild(link)
  }

  if (!document.querySelector(`script[src="${JS_URL}"]`)) {
    const script = document.createElement('script')
    // El bundle de Payphone es un módulo ES: sin type="module" no se ejecuta.
    script.type = 'module'
    script.src = JS_URL
    document.head.appendChild(script)
  }
}

function waitForBox(timeoutMs = 15000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now()

    const poll = () => {
      if (typeof PPaymentButtonBox !== 'undefined') return resolve()
      if (Date.now() - startedAt > timeoutMs) {
        return reject(new Error('No se pudo cargar el formulario de pago. Revisa tu conexión e intenta de nuevo.'))
      }
      window.setTimeout(poll, 150)
    }

    poll()
  })
}

export function usePayphoneBox() {
  function load(): Promise<void> {
    if (!loader) {
      loader = (async () => {
        injectResources()
        await waitForBox()
      })().catch((error) => {
        // Si el CDN falló, el siguiente intento vuelve a cargar desde cero.
        loader = null
        throw error
      })
    }
    return loader
  }

  /** Monta la Cajita dentro de <div id="pp-button">, que ya debe estar en el DOM. */
  async function mount(config: CajitaConfig, email: string, phoneNumber: string, documentId: string) {
    await load()

    const box = new PPaymentButtonBox({
      token: config.token,
      clientTransactionId: config.clientTransactionId,
      amount: config.amount,
      amountWithoutTax: config.amountWithoutTax,
      currency: 'USD',
      storeId: config.storeId,
      reference: config.reference,
      lang: 'es',
      defaultMethod: 'card',
      timeZone: -5,
      email,
      phoneNumber,
      documentId,
    })

    box.render('pp-button')
  }

  return { load, mount }
}
