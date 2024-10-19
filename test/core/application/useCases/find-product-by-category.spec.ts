import { Decimal } from 'decimal.js'

import { Category } from '@core/domain/valueObjects/Category'
import { Product } from '@core/domain/entities/Product'
import { FindProductsByCategoryUseCase } from '@core/aplication/useCases/find-product-by-category'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'

describe('FindProductByCategoryUseCase', () => {
  let sut: FindProductsByCategoryUseCase
  let mockProductRepository: InMemoryProductRepository

  beforeEach(() => {
    mockProductRepository = new InMemoryProductRepository()
    sut = new FindProductsByCategoryUseCase(mockProductRepository)
  })

  it('should find products by category', async () => {
    const product1 = new Product(
      'Product 1',
      new Decimal(100),
      'Description 1',
      new Category('Acompanhamento'),
      '1',
    )
    const product2 = new Product(
      'Product 2',
      new Decimal(200),
      'Description 2',
      new Category('Acompanhamento'),
      '2',
    )
    const product3 = new Product(
      'Product 3',
      new Decimal(300),
      'Description 3',
      new Category('Lanche'),
      '3',
    )
    mockProductRepository.register(product1)
    mockProductRepository.register(product2)
    mockProductRepository.register(product3)

    const products = await sut.execute('Acompanhamento')

    expect(products).toHaveLength(2)
    expect(products[0].name).toBe('Product 1')
    expect(products[1].name).toBe('Product 2')
  })

  it('should return empty array when no products are found', async () => {
    const products = await sut.execute('Acompanhamento')

    expect(products).toHaveLength(0)
  })

  it('should throw an error if category is invalid', async () => {
    await expect(sut.execute('Invalid Category')).rejects.toThrow(
      'Invalid category.',
    )
  })
})
