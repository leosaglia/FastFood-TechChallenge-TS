import { Product } from '@core/domain/entities/Product'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { Category } from '@core/domain/valueObjects/Category'

export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = []

  async register(product: Product): Promise<void> {
    this.products.push(product)
  }

  async edit(product: Product): Promise<void> {
    const productIndex = this.products.findIndex(
      (p) => p.getId() === product.getId(),
    )
    this.products[productIndex] = product
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.getId() !== id)
  }

  async findById(id: string): Promise<Product | null> {
    /* Ver comportamento Promise.all 
    console.log('procurando por id: ', id)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    console.log('acho por id: ', id)
    */

    return this.products.find((p) => p.getId() === id) || null
  }

  async findByCategory(category: Category): Promise<Product[]> {
    return this.products.filter(
      (p) => p.getCategory().getValue() === category.getValue(),
    )
  }
}
