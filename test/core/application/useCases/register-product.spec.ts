import { describe, beforeEach, it, expect } from 'vitest'
import Decimal from 'decimal.js'
import { RegisterProductDto } from '@core/aplication/dtos/register-product-dto'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { RegisterProductUseCase } from '@core/aplication/useCases/register-product'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'

describe('RegisterProductUseCase', () => {
  let sut: RegisterProductUseCase
  let mockProductRepository: ProductRepository

  beforeEach(() => {
    mockProductRepository = new InMemoryProductRepository()
    sut = new RegisterProductUseCase(mockProductRepository)
  })

  it('should register a product successfully', async () => {
    const dto: RegisterProductDto = {
      name: 'Duplo Cheddar',
      price: new Decimal(100),
      description: 'Pão, carne, queijo, bacon, tomate, alface e maionese.',
      category: 'Lanche',
    }

    const registeredProduct = await sut.execute(dto)

    expect(registeredProduct.name).toBe(dto.name)
    expect(registeredProduct.price).toStrictEqual(dto.price)
    expect(registeredProduct.description).toBe(dto.description)
    expect(registeredProduct.category).toBe(dto.category)
    expect(registeredProduct.id).toBeDefined()
  })

  const productWithInvalidName = {
    name: '',
    price: new Decimal(100),
    description: 'Pão, carne, queijo, bacon, tomate, alface e maionese.',
    category: 'Lanche',
  }

  const productWithInvalidPrice = {
    name: 'Duplo Cheddar',
    price: new Decimal(-100),
    description: 'Pão, carne, queijo, bacon, tomate, alface e maionese.',
    category: 'Lanche',
  }

  const productWithInvalidDescription = {
    name: 'Duplo Cheddar',
    price: new Decimal(100),
    description: '',
    category: 'Lanche',
  }

  const productWithInvalidCategory = {
    name: 'Duplo Cheddar',
    price: new Decimal(100),
    description: 'Pão, carne, queijo, bacon, tomate, alface e maionese.',
    category: 'Invalid Category',
  }

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
