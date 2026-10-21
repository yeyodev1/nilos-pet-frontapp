import APIBase from './httpBase'
import type { Branch, Category, Paginated, Product, ProductType } from '@/types'

export interface ProductListParams {
  search?: string
  category?: string
  type?: ProductType
  featured?: boolean
  page?: number
  limit?: number
}

/** Catálogo público: categorías, productos y sucursales. Solo lectura. */
class CatalogService extends APIBase {
  async getCategories(): Promise<Category[]> {
    const { data } = await this.get<Category[]>('categories')
    return data
  }

  async listProducts(params: ProductListParams = {}): Promise<Paginated<Product>> {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    if (params.category) query.set('category', params.category)
    if (params.type) query.set('type', params.type)
    if (params.featured) query.set('featured', '1')
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))

    const qs = query.toString()
    const { data } = await this.get<Paginated<Product>>(qs ? `products?${qs}` : 'products')
    return data
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const { data } = await this.get<Product>(`products/${encodeURIComponent(slug)}`)
    return data
  }

  async getBranches(): Promise<Branch[]> {
    const { data } = await this.get<Branch[]>('branches')
    return data
  }
}

export const catalogService = new CatalogService()
