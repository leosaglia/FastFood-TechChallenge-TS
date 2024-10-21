import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'

export abstract class ProductRepository {
  abstract register(product: Product): Promise<void>
  abstract edit(product: Product): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Product | null>
  abstract findByCategory(category: Category): Promise<Product[]>
}
