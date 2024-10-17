import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { ProductRepository } from '../repositories/product-repository'

export class FindProductsByCategoryUseCase {
  private productRepository: ProductRepository

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository
  }

  async execute(category: string): Promise<Product[]> {
    const categoryValue = new Category(category)

    return this.productRepository.findByCategory(categoryValue)
  }
}
