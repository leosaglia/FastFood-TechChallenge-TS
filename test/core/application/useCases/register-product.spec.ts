import Decimal from 'decimal.js'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { RegisterProductUseCase } from '@core/aplication/useCases/register-product'
import { InMemoryProductRepository } from '@adapter/driven/repositories/in-memory/in-memory-product-repository'
import { makeRegisterProductRequest } from '@test/factories/product-factory'
import { Product } from '@core/domain/entities/product'
import { BadRequestError } from '@core/error-handling/bad-request-error'

describe('RegisterProductUseCase', () => {
  let sut: RegisterProductUseCase
  let mockProductRepository: ProductRepository

  beforeEach(() => {
    mockProductRepository = new InMemoryProductRepository()
    sut = new RegisterProductUseCase(mockProductRepository)
  })

  it('should register a product successfully', async () => {
    const product = makeRegisterProductRequest()

    const result = await sut.execute(product)
    const { product: registeredProduct } = result.value as { product: Product }

    expect(result.isSuccess).toBeTruthy()
    expect(registeredProduct.getName()).toBe(product.name)
    expect(registeredProduct.getPrice()).toStrictEqual(product.price)
    expect(registeredProduct.getDescription()).toBe(product.description)
    expect(registeredProduct.getCategory()).toBe(product.category)
    expect(registeredProduct.getId()).toBeDefined()
  })

  const productWithInvalidName = makeRegisterProductRequest({ name: '' })

  const productWithInvalidPrice = makeRegisterProductRequest({
    price: new Decimal(-100),
  })

  const productWithInvalidDescription = makeRegisterProductRequest({
    description: '',
  })

  const productWithInvalidCategory = makeRegisterProductRequest({
    category: 'Invalid Category',
  })

  it.each([
    [productWithInvalidName, 'Invalid name.'],
    [productWithInvalidPrice, 'Invalid price.'],
    [productWithInvalidDescription, 'Invalid description.'],
    [productWithInvalidCategory, 'Invalid category.'],
  ])(
    'should throw an error when pass invalid fields to register a product',
    async (invalidProduct, excMessage) => {
      const result = await sut.execute(invalidProduct)
      const error = result.value as BadRequestError

      expect(result.isFailure).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequestError)
      expect(error.message).toBe(excMessage)
    },
  )
})
