import APIBase from './httpBase'
import type {
  Booking,
  BookingStatus,
  Branch,
  Category,
  ExamResult,
  Order,
  Paginated,
  Product,
  ProductType,
  SessionUser,
} from '@/types'

// Tipos propios del panel: viven acá y no en types/index.ts porque solo los
// consume el admin y ese archivo lo comparten las vistas públicas.

export interface AdminStats {
  products: number
  published: number
  unpriced: number
  orders: number
  paidOrders: number
  bookings: number
  pendingBookings: number
  customers: number
  examResults: number
}

/** Resumen de la respuesta de Payphone guardada en la orden. */
export interface PayphoneSummary {
  transactionStatus?: string
  statusCode?: number
  transactionId?: string | number
  authorizationCode?: string
  message?: string
}

export type AdminOrder = Order & { payphone?: PayphoneSummary | null }

export interface AdminProductParams {
  search?: string
  category?: string
  type?: ProductType | ''
  /** '1' publicados, '0' ocultos. */
  published?: string
  /** '0' = solo los que siguen sin precio. */
  priced?: string
  page?: number
}

export interface ProductInput {
  name: string
  type: ProductType
  category?: string
  /** Centavos de USD. */
  price: number
  description: string
  bookable: boolean
}

export type ProductPatch = Partial<
  ProductInput & { isPublished: boolean; isFeatured: boolean }
>

export interface CategoryInput {
  name: string
  order: number
}

export interface BranchInput {
  name: string
  address: string
  city: string
  phone: string
  mapsUrl: string
  isActive: boolean
}

export type AdminCustomer = SessionUser & { createdAt?: string }

function qs(params: object): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  }
  const text = query.toString()
  return text ? `?${text}` : ''
}

/** Todo el API privado del panel (:8100/api/admin, con el Bearer del admin). */
class AdminService extends APIBase {
  async getStats(): Promise<AdminStats> {
    const { data } = await this.get<AdminStats>('admin/stats')
    return data
  }

  // ─── Productos ─────────────────────────────────────────────────────────

  async listProducts(params: AdminProductParams = {}): Promise<Paginated<Product>> {
    const { data } = await this.get<Paginated<Product>>(`admin/products${qs(params)}`)
    return data
  }

  async createProduct(input: ProductInput): Promise<Product> {
    const { data } = await this.post<Product>('admin/products', input)
    return data
  }

  async updateProduct(id: string, patch: ProductPatch): Promise<Product> {
    const { data } = await this.put<Product>(`admin/products/${id}`, patch)
    return data
  }

  async deleteProduct(id: string): Promise<void> {
    await this.delete(`admin/products/${id}`)
  }

  async uploadProductImage(id: string, file: File): Promise<Partial<Product>> {
    const form = new FormData()
    form.append('image', file)
    const { data } = await this.post<Partial<Product>>(`admin/products/${id}/images`, form)
    return data
  }

  async deleteProductImage(id: string, publicId: string): Promise<Partial<Product>> {
    const { data } = await this.delete<Partial<Product>>(
      `admin/products/${id}/images/${encodeURIComponent(publicId)}`,
    )
    return data
  }

  // ─── Categorías ────────────────────────────────────────────────────────

  async listCategories(): Promise<Category[]> {
    const { data } = await this.get<Category[]>('admin/categories')
    return data
  }

  async createCategory(input: CategoryInput): Promise<Category> {
    const { data } = await this.post<Category>('admin/categories', input)
    return data
  }

  async updateCategory(id: string, input: Partial<CategoryInput>): Promise<Category> {
    const { data } = await this.put<Category>(`admin/categories/${id}`, input)
    return data
  }

  async deleteCategory(id: string): Promise<void> {
    await this.delete(`admin/categories/${id}`)
  }

  // ─── Sucursales ────────────────────────────────────────────────────────

  async listBranches(): Promise<Branch[]> {
    const { data } = await this.get<Branch[]>('admin/branches')
    return data
  }

  async createBranch(input: BranchInput): Promise<Branch> {
    const { data } = await this.post<Branch>('admin/branches', input)
    return data
  }

  async updateBranch(id: string, input: Partial<BranchInput>): Promise<Branch> {
    const { data } = await this.put<Branch>(`admin/branches/${id}`, input)
    return data
  }

  /** El backend no borra: desactiva la sucursal. */
  async deleteBranch(id: string): Promise<void> {
    await this.delete(`admin/branches/${id}`)
  }

  // ─── Órdenes ───────────────────────────────────────────────────────────

  async listOrders(params: { status?: string; page?: number } = {}): Promise<Paginated<Order>> {
    const { data } = await this.get<Paginated<Order>>(`admin/orders${qs(params)}`)
    return data
  }

  async getOrder(id: string): Promise<AdminOrder> {
    const { data } = await this.get<AdminOrder>(`admin/orders/${id}`)
    return data
  }

  // ─── Reservas ──────────────────────────────────────────────────────────

  async listBookings(params: { status?: string; page?: number } = {}): Promise<Paginated<Booking>> {
    const { data } = await this.get<Paginated<Booking>>(`admin/bookings${qs(params)}`)
    return data
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const { data } = await this.patch<Booking>(`admin/bookings/${id}`, { status })
    return data
  }

  // ─── Resultados de exámenes ────────────────────────────────────────────

  async listExamResults(
    params: { documentId?: string; page?: number } = {},
  ): Promise<Paginated<ExamResult>> {
    const { data } = await this.get<Paginated<ExamResult>>(`admin/exam-results${qs(params)}`)
    return data
  }

  async createExamResult(input: {
    file: File
    documentId: string
    title: string
    date: string
    petName: string
    notes: string
  }): Promise<ExamResult> {
    const form = new FormData()
    form.append('file', input.file)
    form.append('documentId', input.documentId)
    form.append('title', input.title)
    form.append('date', input.date)
    form.append('petName', input.petName)
    form.append('notes', input.notes)
    const { data } = await this.post<ExamResult>('admin/exam-results', form)
    return data
  }

  async deleteExamResult(id: string): Promise<void> {
    await this.delete(`admin/exam-results/${id}`)
  }

  // ─── Clientes ──────────────────────────────────────────────────────────

  async listCustomers(
    params: { search?: string; page?: number } = {},
  ): Promise<Paginated<AdminCustomer>> {
    const { data } = await this.get<Paginated<AdminCustomer>>(`admin/customers${qs(params)}`)
    return data
  }
}

export const adminService = new AdminService()
