import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { Either, failure, success } from '@core/error-handling/either'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'

type DeleteProductUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(productId: string): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      return failure(new ResourceNotFoundError('Product not found'))
    }

    await this.productRepository.delete(productId)

    return success(null)
  }
}
