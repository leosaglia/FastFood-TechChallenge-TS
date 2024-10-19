import Decimal from 'decimal.js'

import { Order } from '@core/domain/entities/Order'
import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { AddItemToOrderUseCase } from '@core/aplication/useCases/add-item-to-order'
import { InMemoryOrderRepository } from '../repositories/in-memory-order-repository'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'
import { makeProduct } from '@test/factories/product-factory'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'

describe('AddItemToOrderUseCase', () => {
  let sut: AddItemToOrderUseCase
  let mockOrderRepository: OrderRepository
  let mockProductRepository: ProductRepository

  beforeEach(() => {
    mockOrderRepository = new InMemoryOrderRepository()
    mockProductRepository = new InMemoryProductRepository()
    sut = new AddItemToOrderUseCase(mockOrderRepository, mockProductRepository)
  })

  it('should add a new item to an order', async () => {
    const order = new Order()
    await mockOrderRepository.register(order)
    const product = makeProduct({
      name: 'Hamburguer duplo',
      price: new Decimal(10),
    })
    await mockProductRepository.register(product)
    const quantity = 2

    const result = await sut.execute({
      orderId: order.getId(),
      productId: product.getId(),
      quantity,
    })

    const { order: updatedOrder } = result.value as { order: Order }

    expect(result.isSuccess()).toBe(true)
    expect(updatedOrder.getItems()).toHaveLength(1)
    expect(updatedOrder.getItems()[0].getProduct().getId()).toBe(
      product.getId(),
    )
    expect(updatedOrder.getItems()[0].getQuantity()).toBe(quantity)
    expect(updatedOrder.getTotal().toNumber()).toBe(20)
  })

  it('should update an existing item in an order', async () => {
    const order = new Order()
    await mockOrderRepository.register(order)

    const product = makeProduct({
      name: 'Hamburguer duplo',
      price: new Decimal(10),
    })
    await mockProductRepository.register(product)
    const quantity = 2

    await sut.execute({
      orderId: order.getId(),
      productId: product.getId(),
      quantity,
    })

    const result = await sut.execute({
      orderId: order.getId(),
      productId: product.getId(),
      quantity: 3,
    })

    const { order: updatedOrder } = result.value as { order: Order }

    expect(result.isSuccess()).toBe(true)
    expect(updatedOrder.getItems()).toHaveLength(1)
    expect(updatedOrder.getItems()[0].getProduct().getId()).toBe(
      product.getId(),
    )
    expect(updatedOrder.getItems()[0].getQuantity()).toBe(3)
    expect(updatedOrder.getTotal().toNumber()).toBe(30)
  })

  it('should throw an error if order does not exist', async () => {
    const productId = '123'
    const quantity = 2

    const result = await sut.execute({
      orderId: 'invalid_order_id',
      productId,
      quantity,
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    const error = result.value as ResourceNotFoundError
    expect(error.message).toBe('Order not found')
  })

  it('should throw an error if product does not exist', async () => {
    const order = new Order()
    await mockOrderRepository.register(order)
    const quantity = 2

    const result = await sut.execute({
      orderId: order.getId(),
      productId: 'invalid_product_id',
      quantity,
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    const error = result.value as ResourceNotFoundError
    expect(error.message).toBe('Product not found')
  })
})
