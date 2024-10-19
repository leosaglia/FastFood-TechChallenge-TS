import { DeleteProductUseCase } from '@core/aplication/useCases/delete-product'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'
import { makeProduct } from '@test/factories/product-factory'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'

describe('DeleteProductUseCase', () => {
  let sut: DeleteProductUseCase
  let mockProductRepository: InMemoryProductRepository

  beforeEach(() => {
    mockProductRepository = new InMemoryProductRepository()
    sut = new DeleteProductUseCase(mockProductRepository)
  })

  it('should delete a product successfully', async () => {
    const productId = '123'
    const existingProduct = makeProduct({ id: productId })
    mockProductRepository.register(existingProduct)

    const result = await sut.execute(productId)

    expect(result.isSuccess()).toBeTruthy()
    expect(await mockProductRepository.findById(productId)).toBeNull()
  })

  it('should throw an error if the product does not exist', async () => {
    const productId = '123'
    const result = await sut.execute(productId)

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    const error = result.value as ResourceNotFoundError
    expect(error.message).toBe('Product not found')
  })
})
