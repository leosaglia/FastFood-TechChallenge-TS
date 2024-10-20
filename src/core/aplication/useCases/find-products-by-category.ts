import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { ProductRepository } from '../repositories/product-repository'
import { Either, failure, success } from '@core/error-handling/either'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'

type FindProductsByCategoryUseCaseResponse = Either<
  BadRequestError | NoMappedError,
  {
    products: Product[]
  }
>

export class FindProductsByCategoryUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(
    category: string,
  ): Promise<FindProductsByCategoryUseCaseResponse> {
    try {
      const categoryValue = new Category(category)

      const products =
        await this.productRepository.findByCategory(categoryValue)

      return success({ products })
    } catch (error) {
      if (error instanceof BadRequestError)
        return failure(new BadRequestError(error.message))

      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
