import { Product } from '@core/domain/entities/Product'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { Category } from '@core/domain/valueObjects/Category'

export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = []

  async register(product: Product): Promise<Product> {
    this.products.push(product)
    return product
  }

  async edit(product: Product): Promise<Product> {
    const productIndex = this.products.findIndex(
      (p) => p.getId() === product.getId(),
    )
    this.products[productIndex] = product
    return product
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.getId() !== id)
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.getId() === id) || null
  }

  async findByCategory(category: Category): Promise<Product[]> {
    return this.products.filter(
      (p) => p.getCategory().getValue() === category.getValue(),
    )
  }
}
