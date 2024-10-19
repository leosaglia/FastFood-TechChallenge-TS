import Decimal from 'decimal.js'

import { Order } from '@core/domain/entities/Order'
import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { AddItemToOrderUseCase } from '@core/aplication/useCases/add-item-to-order'
import { InMemoryOrderRepository } from '../repositories/in-memory-order-repository'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'

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
    const order = await mockOrderRepository.register(new Order())
    const product = await mockProductRepository.register(
      new Product(
        'Hamburguer duplo',
        new Decimal(10),
        'Hamburguer duplo com queijo',
        new Category('Lanche'),
      ),
    )
    const quantity = 2

    const updatedOrder = await sut.execute(
      order.getId(),
      product.getId(),
      quantity,
    )

    expect(updatedOrder.getItems()).toHaveLength(1)
    expect(updatedOrder.getItems()[0].getProduct().getId()).toBe(
      product.getId(),
    )
    expect(updatedOrder.getItems()[0].getQuantity()).toBe(quantity)
    expect(updatedOrder.getTotal().toNumber()).toBe(20)
  })

  it('should update an existing item in an order', async () => {
    const order = await mockOrderRepository.register(new Order())
    const product = await mockProductRepository.register(
      new Product(
        'Hamburguer duplo',
        new Decimal(10),
        'Hamburguer duplo com queijo',
        new Category('Lanche'),
      ),
    )
    const quantity = 2

    await sut.execute(order.getId(), product.getId(), quantity)
    const updatedOrder = await sut.execute(order.getId(), product.getId(), 3)

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

    await expect(
      sut.execute('invalid_order_id', productId, quantity),
    ).rejects.toThrow('Order not found')
  })

  it('should throw an error if product does not exist', async () => {
    const order = await mockOrderRepository.register(new Order())
    const quantity = 2

    await expect(
      sut.execute(order.getId(), 'invalid_product_id', quantity),
    ).rejects.toThrow('Product not found')
  })
})
