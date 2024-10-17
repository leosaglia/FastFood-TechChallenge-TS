import { Product } from '@core/domain/entities/Product'

export interface ProductRepository {
  register(product: Product): Promise<Product>
}
