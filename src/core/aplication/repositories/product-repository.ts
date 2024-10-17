import { Product } from '@core/domain/entities/Product'

export interface ProductRepository {
  register(product: Product): Promise<Product>
  edit(product: Product): Promise<Product>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Product | null>
}
