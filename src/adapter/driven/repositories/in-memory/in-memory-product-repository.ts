import { Product } from '@core/domain/entities/product'
import { ProductRepository } from '@core/aplication/ports/repositories/product-repository'

export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = []

  async create(product: Product): Promise<void> {
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

  async findMany(query: { category?: string }): Promise<Product[]> {
    const { category } = query
    const products = this.products

    if (!category) {
      return products
    }

    return this.products.filter((p) => p.getCategory() === category)
  }
}
