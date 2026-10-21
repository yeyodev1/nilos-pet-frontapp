import { defineStore } from 'pinia'
import type { Branch, Product } from '@/types'

export interface CartLine {
  productId: string
  slug: string
  name: string
  /** Centavos por unidad. */
  price: number
  type: Product['type']
  image: string
  qty: number
  /** Solo servicios: reserva elegida en el detalle. */
  branchId?: string
  branchName?: string
  scheduledFor?: string
}

const STORAGE_KEY = 'nilos_cart'

function load(): CartLine[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: load() as CartLine[],
  }),

  getters: {
    count: (state) => state.lines.reduce((sum, l) => sum + l.qty, 0),
    /** Centavos. */
    total: (state) => state.lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    isEmpty: (state) => state.lines.length === 0,
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines))
      } catch {
        // almacenamiento lleno o bloqueado: el carrito sigue en memoria
      }
    },

    add(product: Product, extra?: Partial<Pick<CartLine, 'branchId' | 'branchName' | 'scheduledFor'>>) {
      const existing = this.lines.find((l) => l.productId === product._id)
      if (existing && product.type === 'physical') {
        existing.qty += 1
      } else if (!existing) {
        this.lines.push({
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          type: product.type,
          image: product.images[0]?.url || '',
          qty: 1,
          ...extra,
        })
      }
      this.persist()
    },

    setQty(productId: string, qty: number) {
      const line = this.lines.find((l) => l.productId === productId)
      if (!line) return
      line.qty = Math.max(1, qty)
      this.persist()
    },

    setBooking(productId: string, branch: Branch, scheduledFor: string) {
      const line = this.lines.find((l) => l.productId === productId)
      if (!line) return
      line.branchId = branch._id
      line.branchName = branch.name
      line.scheduledFor = scheduledFor
      this.persist()
    },

    remove(productId: string) {
      this.lines = this.lines.filter((l) => l.productId !== productId)
      this.persist()
    },

    clear() {
      this.lines = []
      this.persist()
    },
  },
})
