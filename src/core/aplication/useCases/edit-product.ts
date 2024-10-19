import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { EditProductUseCaseRequest } from '../dtos/request/edit-product-use-case-request'
import { Either, failure, success } from '@core/error-handling/Either'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'

type EditProductUseCaseResponse = Either<
  NoMappedError | BadRequestError | ResourceNotFoundError,
  {
    product: Product
  }
>

export class EditProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    id,
    name,
    price,
    description,
    category,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    try {
      const productFound = await this.productRepository.findById(id)

      if (!productFound) {
        return failure(new ResourceNotFoundError('Product not found.'))
      }

      const product = new Product(
        name,
        price,
        description,
        new Category(category),
        id,
      )

      this.productRepository.edit(product)

      return success({ product })
    } catch (error) {
      if (error instanceof BadRequestError)
        return failure(new BadRequestError(error.message))

      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
