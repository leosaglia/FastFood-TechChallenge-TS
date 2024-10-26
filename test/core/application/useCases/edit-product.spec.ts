import { Decimal } from 'decimal.js'

import { Category } from '@core/domain/valueObjects/category'
import { EditProductUseCase } from '@core/aplication/useCases/edit-product'
import { InMemoryProductRepository } from '@adapter/driven/repositories/in-memory/in-memory-product-repository'
import {
  makeEditProductRequest,
  makeProduct,
} from '@test/factories/product-factory'
import { Product } from '@core/domain/entities/product'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { BadRequestError } from '@core/error-handling/bad-request-error'

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
    mockProductRepository.create(existingProduct)

    const productToEdit = makeEditProductRequest({
      id: '1',
      category: 'Bebida',
    })

    const result = await sut.execute(productToEdit)
    const { product: updatedProduct } = result.value as { product: Product }

    expect(result.isSuccess()).toBeTruthy()
    expect(updatedProduct.getName()).toBe(productToEdit.name)
    expect(updatedProduct.getPrice()).toStrictEqual(productToEdit.price)
    expect(updatedProduct.getDescription()).toBe(productToEdit.description)
    expect(updatedProduct.getCategory()).toBe(
      productToEdit.category.toLowerCase(),
    )
    expect(updatedProduct.getId()).toBe(productToEdit.id)
  })

  it('should throw an error if product is not found', async () => {
    const product = makeEditProductRequest({ id: 'non-existent-id' })
    const result = await sut.execute(product)

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)

    const error = result.value as ResourceNotFoundError
    expect(error.message).toBe('Product not found.')
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
      mockProductRepository.create(existingProduct)

      const result = await sut.execute(invalidProduct)

      expect(result.isFailure()).toBeTruthy()
      expect(result.value).toBeInstanceOf(BadRequestError)

      const error = result.value as BadRequestError
      expect(error.message).toBe(excMessage)
    },
  )
})
