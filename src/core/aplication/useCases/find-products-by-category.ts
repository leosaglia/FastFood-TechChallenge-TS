import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { ProductRepository } from '../repositories/product-repository'

interface FindProductsByCategoryUseCaseResponse {
  products: Product[]
}

export class FindProductsByCategoryUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(
    category: string,
  ): Promise<FindProductsByCategoryUseCaseResponse> {
    const categoryValue = new Category(category)

    const products = await this.productRepository.findByCategory(categoryValue)

    return { products }
  }
}
