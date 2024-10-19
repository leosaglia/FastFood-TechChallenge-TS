import Decimal from 'decimal.js'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { RegisterProductUseCase } from '@core/aplication/useCases/register-product'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'
import { makeRegisterProductRequest } from '@test/factories/product-factory'

describe('RegisterProductUseCase', () => {
  let sut: RegisterProductUseCase
  let mockProductRepository: ProductRepository

  beforeEach(() => {
    mockProductRepository = new InMemoryProductRepository()
    sut = new RegisterProductUseCase(mockProductRepository)
  })

  it('should register a product successfully', async () => {
    const product = makeRegisterProductRequest()

    const registeredProduct = (await sut.execute(product)).product

    expect(registeredProduct.getName()).toBe(product.name)
    expect(registeredProduct.getPrice()).toStrictEqual(product.price)
    expect(registeredProduct.getDescription()).toBe(product.description)
    expect(registeredProduct.getCategory().getValue()).toBe(product.category)
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
      await expect(sut.execute(invalidProduct)).rejects.toThrow(excMessage)
    },
  )
})
