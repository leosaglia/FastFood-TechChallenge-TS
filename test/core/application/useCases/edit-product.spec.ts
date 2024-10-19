import { Decimal } from 'decimal.js'

import { Category } from '@core/domain/valueObjects/Category'
import { Product } from '@core/domain/entities/Product'
import { EditProductDto } from '@core/aplication/dtos/edit-product-dto'
import { EditProductUseCase } from '@core/aplication/useCases/edit-product'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'

describe('EditProductUseCase', () => {
  let sut: EditProductUseCase
  let mockProductRepository: InMemoryProductRepository

  beforeEach(() => {
    mockProductRepository = new InMemoryProductRepository()
    sut = new EditProductUseCase(mockProductRepository)
  })

  it('should edit a product successfully', async () => {
    const existingProduct = new Product(
      'Existing Product',
      new Decimal(100),
      'Existing Description',
      new Category('Acompanhamento'),
      '1',
    )
    mockProductRepository.register(existingProduct)

    const dto: EditProductDto = {
      id: '1',
      name: 'Updated Product',
      price: new Decimal(150),
      description: 'Updated Description',
      category: 'Bebida',
    }

    const updatedProduct = await sut.execute(dto)

    expect(updatedProduct.getName()).toBe(dto.name)
    expect(updatedProduct.getPrice()).toStrictEqual(dto.price)
    expect(updatedProduct.getDescription()).toBe(dto.description)
    expect(updatedProduct.getCategory().getValue()).toBe(dto.category)
    expect(updatedProduct.getId()).toBe(dto.id)
  })

  it('should throw an error if product is not found', async () => {
    const dto: EditProductDto = {
      id: 'non-existent-id',
      name: 'Updated Product',
      price: new Decimal(150),
      description: 'Updated Description',
      category: new Category('Bebida').getValue(),
    }

    await expect(sut.execute(dto)).rejects.toThrow('Product not found.')
  })

  const productWithInvalidName: EditProductDto = {
    id: '1',
    name: '',
    price: new Decimal(100),
    description: 'Pão, carne, queijo, bacon, tomate, alface e maionese.',
    category: 'Lanche',
  }

  const productWithInvalidPrice: EditProductDto = {
    id: '1',
    name: 'Duplo Cheddar',
    price: new Decimal(-100),
    description: 'Pão, carne, queijo, bacon, tomate, alface e maionese.',
    category: 'Lanche',
  }

  const productWithInvalidDescription: EditProductDto = {
    id: '1',
    name: 'Duplo Cheddar',
    price: new Decimal(100),
    description: '',
    category: 'Lanche',
  }

  const productWithInvalidCategory: EditProductDto = {
    id: '1',
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
    'should throw an error if product data is invalid',
    async (invalidProduct, excMessage) => {
      const existingProduct = new Product(
        'Existing Product',
        new Decimal(100),
        'Existing Description',
        new Category('Acompanhamento'),
        '1',
      )
      mockProductRepository.register(existingProduct)

      await expect(sut.execute(invalidProduct)).rejects.toThrow(excMessage)
    },
  )
})
