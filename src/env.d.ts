/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_META_PIXEL_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Cajita de Pagos de Payphone — el script del CDN define esta clase global.
 * https://docs.payphone.app/cajita-de-pagos
 */
declare class PPaymentButtonBox {
  constructor(config: {
    token: string
    clientTransactionId: string
    amount: number
    amountWithoutTax: number
    currency: string
    storeId: string
    reference: string
    lang?: string
    defaultMethod?: string
    timeZone?: number
    email?: string
    phoneNumber?: string
    documentId?: string
  })
  render(elementId: string): void
}
