/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// ─── Catálogo ───────────────────────────────────────────────────────────

export interface Category {
  _id: string
  name: string
  slug: string
  order: number
}

export type ProductType = 'physical' | 'service'

export interface ProductImage {
  url: string
  publicId: string
}

export interface Product {
  _id: string
  code: string
  name: string
  slug: string
  description: string
  /** Centavos de USD. 0 = sin precio asignado (no comprable). */
  price: number
  type: ProductType
  category: Category | string | null
  images: ProductImage[]
  isPublished: boolean
  isFeatured: boolean
  /** Solo servicios: se reserva en una sucursal. */
  bookable: boolean
  createdAt?: string
}

export interface Branch {
  _id: string
  name: string
  address: string
  city: string
  phone: string
  mapsUrl: string
  isActive: boolean
}

// ─── Órdenes y pago (Cajita de Payphone) ────────────────────────────────

export type OrderStatus = 'pending' | 'paid' | 'canceled' | 'failed'
export type Fulfillment = 'pickup' | 'delivery'

export interface OrderItemInput {
  productId: string
  qty: number
  /** Solo servicios: sucursal y fecha preferida de la reserva. */
  branchId?: string
  scheduledFor?: string
}

export interface OrderCustomer {
  name: string
  email: string
  phone: string
  documentId: string
}

export interface CreateOrderInput {
  items: OrderItemInput[]
  customer: OrderCustomer
  fulfillment: Fulfillment
  branchId?: string
  deliveryAddress?: string
}

export interface OrderItem {
  product: string | Product
  name: string
  /** Centavos por unidad al momento de la compra. */
  price: number
  qty: number
  branch?: string | Branch | null
  scheduledFor?: string | null
}

export interface Order {
  _id: string
  number: number
  user: string | null
  customer: OrderCustomer
  items: OrderItem[]
  /** Centavos. */
  total: number
  clientTransactionId: string
  status: OrderStatus
  fulfillment: Fulfillment
  branch?: string | Branch | null
  deliveryAddress?: string
  createdAt: string
}

/** Configuración que el backend devuelve para montar la Cajita. */
export interface CajitaConfig {
  token: string
  storeId: string
  clientTransactionId: string
  /** Centavos. */
  amount: number
  amountWithoutTax: number
  reference: string
}

export interface CreateOrderResponse {
  order: Order
  cajita: CajitaConfig
}

// ─── Reservas ───────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'done' | 'canceled'

export interface Booking {
  _id: string
  product: string | Product
  branch: string | Branch
  order: string | null
  customer: { name: string; email: string; phone: string }
  preferredAt: string
  status: BookingStatus
  notes: string
  createdAt: string
}

export interface CreateBookingInput {
  productId: string
  branchId: string
  customer: { name: string; email: string; phone: string }
  preferredAt: string
  notes?: string
}

// ─── Resultados de exámenes ─────────────────────────────────────────────

export interface ExamResult {
  _id: string
  documentId: string
  petName: string
  title: string
  date: string
  fileUrl: string
  notes: string
  createdAt?: string
}
