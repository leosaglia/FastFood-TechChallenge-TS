import { describe, it, expect, beforeEach } from 'vitest'
import { Decimal } from 'decimal.js'

import { Category } from '@core/domain/enums/Category'
import { DeleteProductUseCase } from '@core/aplication/useCases/delete-product'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'
import { Product } from '@core/domain/entities/Product'

describe('DeleteProductUseCase', () => {
  let sut: DeleteProductUseCase
  let mockProductRepository: InMemoryProductRepository

  beforeEach(() => {
    mockProductRepository = new InMemoryProductRepository()
    sut = new DeleteProductUseCase(mockProductRepository)
  })

  it('should delete a product successfully', async () => {
    const productId = '123'
    const existingProduct = new Product(
      'Existing Product',
      new Decimal(100),
      'Existing Description',
      Category.Acompanhamento,
      productId,
    )
    mockProductRepository.register(existingProduct)

    await sut.execute(productId)

    expect(await mockProductRepository.findById(productId)).toBeNull()
  })

  it('should throw an error if the product does not exist', async () => {
    const productId = '123'

    await expect(sut.execute(productId)).rejects.toThrow('Product not found')
  })
})
