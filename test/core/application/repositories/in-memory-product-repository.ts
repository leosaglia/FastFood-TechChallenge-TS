import { Product } from '@core/domain/entities/Product'
import { ProductRepository } from '@core/aplication/repositories/product-repository'

export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = []

  async register(product: Product): Promise<Product> {
    this.products.push(product)
    return product
  }

  async edit(product: Product): Promise<Product> {
    const productIndex = this.products.findIndex((p) => p.id === product.id)
    this.products[productIndex] = product
    return product
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.id !== id)
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) || null
  }
}
