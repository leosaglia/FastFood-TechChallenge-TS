import { Product } from '@core/domain/entities/product'
import { Category } from '@core/domain/valueObjects/category'
import { ProductRepository } from '../repositories/product-repository'
import { Either, failure, success } from '@core/error-handling/either'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'

type FindProductsUseCaseResponse = Either<
  BadRequestError | NoMappedError,
  {
    products: Product[]
  }
>

export class FindProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(query: {
    category?: string
  }): Promise<FindProductsUseCaseResponse> {
    try {
      const { category } = query

      if (category) {
        query.category = new Category(category).getValue()
      }

      const products = await this.productRepository.findMany(query)

      return success({ products })
    } catch (error) {
      if (error instanceof BadRequestError)
        return failure(new BadRequestError(error.message))

      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
