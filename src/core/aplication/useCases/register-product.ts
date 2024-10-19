import { Decimal } from 'decimal.js'

import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { RegisterProductUseCaseRequest } from '../dtos/request/register-product-use-case-request'
import { Either, success, failure } from '@core/error-handling/Either'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'

type RegisterProductUseCaseResponse = Either<
  NoMappedError | BadRequestError,
  {
    product: Product
  }
>

export class RegisterProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    name,
    price,
    description,
    category,
  }: RegisterProductUseCaseRequest): Promise<RegisterProductUseCaseResponse> {
    try {
      const product = new Product(
        name,
        new Decimal(price),
        description,
        new Category(category),
      )

      await this.productRepository.register(product)

      return success({ product })
    } catch (error) {
      if (error instanceof BadRequestError)
        return failure(new BadRequestError(error.message))

      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
