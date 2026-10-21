import type { Category, Product } from '@/types'

/** El API suele poblar category como objeto, pero puede llegar como id o null. */
export function productCategory(product: Product): Category | null {
  return product.category && typeof product.category === 'object' ? product.category : null
}

export function productCategoryName(product: Product): string {
  return productCategory(product)?.name || ''
}

/**
 * Icono del placeholder cuando el producto no tiene foto: se infiere de la
 * categoría para que el catálogo sin imágenes no se vea genérico.
 */
export function productIcon(product: Product): string {
  if (product.type === 'service') return 'fa-solid fa-stethoscope'

  const slug = productCategory(product)?.slug || ''
  const porPalabra: Array<[RegExp, string]> = [
    [/aliment|comida|food|snack/, 'fa-solid fa-bowl-food'],
    [/medicin|farmac|salud|vitamin/, 'fa-solid fa-prescription-bottle-medical'],
    [/higien|shampoo|aseo|peluquer/, 'fa-solid fa-soap'],
    [/juguete|toy/, 'fa-solid fa-baseball'],
    [/accesor|collar|correa|ropa/, 'fa-solid fa-tag'],
    [/gato|cat/, 'fa-solid fa-cat'],
    [/perro|dog/, 'fa-solid fa-dog'],
    [/ave|pajar/, 'fa-solid fa-dove'],
    [/pez|acuari/, 'fa-solid fa-fish'],
  ]

  for (const [patron, icono] of porPalabra) {
    if (patron.test(slug)) return icono
  }
  return 'fa-solid fa-paw'
}
