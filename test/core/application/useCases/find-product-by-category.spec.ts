import { Category } from '@core/domain/valueObjects/Category'
import { FindProductsByCategoryUseCase } from '@core/aplication/useCases/find-products-by-category'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'
import { makeProduct } from '@test/factories/product-factory'
import { Product } from '@core/domain/entities/Product'
import { BadRequestError } from '@core/error-handling/bad-request-error'

describe('FindProductByCategoryUseCase', () => {
  let sut: FindProductsByCategoryUseCase
  let mockProductRepository: InMemoryProductRepository

  beforeEach(() => {
    mockProductRepository = new InMemoryProductRepository()
    sut = new FindProductsByCategoryUseCase(mockProductRepository)
  })

  it('should find products by category', async () => {
    const product1 = makeProduct({
      name: 'Product 1',
      category: new Category('Acompanhamento'),
    })

    const product2 = makeProduct({
      name: 'Product 2',
      category: new Category('Acompanhamento'),
    })

    const product3 = makeProduct({
      name: 'Product 3',
      category: new Category('Lanche'),
    })
    mockProductRepository.register(product1)
    mockProductRepository.register(product2)
    mockProductRepository.register(product3)

    const result = await sut.execute('Acompanhamento')

    const { products } = result.value as { products: Product[] }

    expect(result.isSuccess()).toBe(true)
    expect(products).toHaveLength(2)
    expect(products[0].getName()).toBe('Product 1')
    expect(products[1].getName()).toBe('Product 2')
  })

  it('should return empty array when no products are found', async () => {
    const result = await sut.execute('Acompanhamento')

    const { products } = result.value as { products: Product[] }

    expect(result.isSuccess()).toBe(true)
    expect(products).toHaveLength(0)
  })

  it('should throw an error if category is invalid', async () => {
    const result = await sut.execute('Invalid Category')
    const error = result.value as BadRequestError

    expect(result.isFailure()).toBe(true)
    expect(error.message).toBe('Invalid category.')
  })
})
