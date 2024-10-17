import { Product } from '@core/domain/entities/Product'
import { ProductRepository } from '@core/aplication/repositories/product-repository'

export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = []

  async register(product: Product): Promise<Product> {
    this.products.push(product)
    return product
  }
}
