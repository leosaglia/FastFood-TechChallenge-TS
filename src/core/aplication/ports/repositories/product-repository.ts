import { Product } from '@core/domain/entities/product'

export abstract class ProductRepository {
  abstract create(product: Product): Promise<void>
  abstract edit(product: Product): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Product | null>
  abstract findMany(query: { category?: string }): Promise<Product[]>
}
