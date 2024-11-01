import { Decimal } from 'decimal.js'

import { Product } from '@core/domain/entities/product'
import { Category } from '@core/domain/valueObjects/category'
import { ProductRepository } from '@core/aplication/ports/repositories/product-repository'
import { CreateProductUseCaseRequest } from '../dtos/request/create-product-use-case-request'
import { Either, success, failure } from '@core/error-handling/either'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'

type CreateProductUseCaseResponse = Either<
  NoMappedError | BadRequestError,
  {
    product: Product
  }
>

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    name,
    price,
    description,
    category,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    try {
      const product = new Product(
        name,
        new Decimal(price),
        description,
        new Category(category),
      )

      await this.productRepository.create(product)

      return success({ product })
    } catch (error) {
      if (error instanceof BadRequestError)
        return failure(new BadRequestError(error.message))

      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
