import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'

export interface ProductRepository {
  register(product: Product): Promise<void>
  edit(product: Product): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Product | null>
  findByCategory(category: Category): Promise<Product[]>
}
