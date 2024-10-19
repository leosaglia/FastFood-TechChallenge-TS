import { Decimal } from 'decimal.js'

import { Category } from '@core/domain/valueObjects/Category'
import { EditProductUseCase } from '@core/aplication/useCases/edit-product'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'
import {
  makeEditProductRequest,
  makeProduct,
} from '@test/factories/product-factory'

describe('EditProductUseCase', () => {
  let sut: EditProductUseCase
  let mockProductRepository: InMemoryProductRepository

  beforeEach(() => {
    mockProductRepository = new InMemoryProductRepository()
    sut = new EditProductUseCase(mockProductRepository)
  })

  it('should edit a product successfully', async () => {
    const existingProduct = makeProduct({
      id: '1',
      category: new Category('Acompanhamento'),
    })
    mockProductRepository.register(existingProduct)

    const productToEdit = makeEditProductRequest({
      id: '1',
      category: 'Bebida',
    })

    const updatedProduct = (await sut.execute(productToEdit)).product

    expect(updatedProduct.getName()).toBe(productToEdit.name)
    expect(updatedProduct.getPrice()).toStrictEqual(productToEdit.price)
    expect(updatedProduct.getDescription()).toBe(productToEdit.description)
    expect(updatedProduct.getCategory().getValue()).toBe(productToEdit.category)
    expect(updatedProduct.getId()).toBe(productToEdit.id)
  })

  it('should throw an error if product is not found', async () => {
    const product = makeEditProductRequest({ id: 'non-existent-id' })
    await expect(sut.execute(product)).rejects.toThrow('Product not found.')
  })

  const productWithInvalidName = makeEditProductRequest({ name: '' })

  const productWithInvalidPrice = makeEditProductRequest({
    price: new Decimal(-1),
  })

  const productWithInvalidDescription = makeEditProductRequest({
    description: '',
  })

  const productWithInvalidCategory = makeEditProductRequest({
    category: 'invalid_category',
  })

  it.each([
    [productWithInvalidName, 'Invalid name.'],
    [productWithInvalidPrice, 'Invalid price.'],
    [productWithInvalidDescription, 'Invalid description.'],
    [productWithInvalidCategory, 'Invalid category.'],
  ])(
    'should throw an error if product data is invalid',
    async (invalidProduct, excMessage) => {
      const existingProduct = makeProduct()
      mockProductRepository.register(existingProduct)

      await expect(sut.execute(invalidProduct)).rejects.toThrow(excMessage)
    },
  )
})
