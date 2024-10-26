import Decimal from 'decimal.js'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { CreateProductUseCase } from '@core/aplication/useCases/create-product'
import { InMemoryProductRepository } from '@adapter/driven/repositories/in-memory/in-memory-product-repository'
import { makeCreateProductRequest } from '@test/factories/product-factory'
import { Product } from '@core/domain/entities/product'
import { BadRequestError } from '@core/error-handling/bad-request-error'

describe('CreateProductUseCase', () => {
  let sut: CreateProductUseCase
  let mockProductRepository: ProductRepository

  beforeEach(() => {
    mockProductRepository = new InMemoryProductRepository()
    sut = new CreateProductUseCase(mockProductRepository)
  })

  it('should create a product successfully', async () => {
    const product = makeCreateProductRequest()

    const result = await sut.execute(product)
    const { product: createdProduct } = result.value as { product: Product }

    expect(result.isSuccess).toBeTruthy()
    expect(createdProduct.getName()).toBe(product.name)
    expect(createdProduct.getPrice()).toStrictEqual(product.price)
    expect(createdProduct.getDescription()).toBe(product.description)
    expect(createdProduct.getCategory()).toBe(product.category)
    expect(createdProduct.getId()).toBeDefined()
  })

  const productWithInvalidName = makeCreateProductRequest({ name: '' })

  const productWithInvalidPrice = makeCreateProductRequest({
    price: new Decimal(-100),
  })

  const productWithInvalidDescription = makeCreateProductRequest({
    description: '',
  })

  const productWithInvalidCategory = makeCreateProductRequest({
    category: 'Invalid Category',
  })

  it.each([
    [productWithInvalidName, 'Invalid name.'],
    [productWithInvalidPrice, 'Invalid price.'],
    [productWithInvalidDescription, 'Invalid description.'],
    [productWithInvalidCategory, 'Invalid category.'],
  ])(
    'should throw an error when pass invalid fields to create a product',
    async (invalidProduct, excMessage) => {
      const result = await sut.execute(invalidProduct)
      const error = result.value as BadRequestError

      expect(result.isFailure).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequestError)
      expect(error.message).toBe(excMessage)
    },
  )
})
