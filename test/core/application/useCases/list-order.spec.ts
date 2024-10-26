import Decimal from 'decimal.js'
import { Order } from '@core/domain/entities/order'
import { OrderItem } from '@core/domain/entities/orderItem'
import { ListOrderUseCase } from '@core/aplication/useCases/list-orders'
import { InMemoryOrderRepository } from '@adapter/driven/repositories/in-memory/in-memory-order-repository'
import { InMemoryProductRepository } from '@adapter/driven/repositories/in-memory/in-memory-product-repository'
import { makeProduct } from '@test/factories/product-factory'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'
import { Product } from '@core/domain/entities/product'

describe('ListOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository
  let productRepository: InMemoryProductRepository
  let listOrderUseCase: ListOrderUseCase

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    productRepository = new InMemoryProductRepository()
    listOrderUseCase = new ListOrderUseCase(orderRepository, productRepository)
  })

  it('should list orders with items and product details', async () => {
    const product = makeProduct({
      id: '1',
      name: 'Batata frita',
      price: new Decimal(5),
    })
    productRepository.create(product)

    const product2 = makeProduct({
      id: '2',
      name: 'Hamburguer',
      price: new Decimal(10),
    })
    productRepository.create(product2)

    const order = new Order()
    let orderItem = new OrderItem('1', '1', product.getPrice(), 1)
    order.addItem(orderItem)
    orderItem = new OrderItem('2', '1', product2.getPrice(), 3)
    order.addItem(orderItem)
    orderRepository.create(order)
    orderRepository.create(order)

    const result = await listOrderUseCase.execute()

    expect(result.isSuccess()).toBeTruthy()
    const { orders } = result.value as {
      orders: Array<{
        order: Order
        products: Product[]
      }>
    }

    expect(orders).toHaveLength(2)
    expect(orders[0].order.getItems()).toHaveLength(2)
    expect(orders[0].order.getTotal().toNumber()).toBe(35)
    expect(orders[0].order.getStatus()).toBe('Criado')

    expect(orders[0].order.getItems()[0].getProductId()).toBe('1')
    expect(orders[0].order.getItems()[0].getProductPrice().toNumber()).toBe(5)
    expect(orders[0].order.getItems()[0].getQuantity()).toBe(1)

    expect(orders[0].products).toHaveLength(2)
    expect(orders[0].products[0].getId()).toBe('1')
    expect(orders[0].products[0].getName()).toBe('Batata frita')
    expect(orders[0].products[0].getPrice().toNumber()).toBe(5)
    expect(orders[0].products[0].getCategory()).toBe('acompanhamento')
    expect(orders[0].products[1].getId()).toBe('2')
    expect(orders[0].products[1].getName()).toBe('Hamburguer')
  })

  it('should return an empty list if there are no orders', async () => {
    const result = await listOrderUseCase.execute()

    expect(result.isSuccess()).toBeTruthy()
    const { orders } = result.value as {
      orders: Array<{
        order: Order
        products: Product[]
      }>
    }
    expect(orders).toStrictEqual([])
  })

  it('should return an error if a product is not found', async () => {
    const order = new Order()
    const orderItem = new OrderItem('1', order.getId(), new Decimal(10), 2)
    order.addItem(orderItem)
    orderRepository.create(order)

    const result = await listOrderUseCase.execute()

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    const error = result.value as ResourceNotFoundError
    expect(error.message).toBe('Product with id 1 not found')
  })

  it('should handle unexpected errors gracefully', async () => {
    vi.spyOn(orderRepository, 'findMany').mockImplementation(() => {
      throw new Error('Unexpected error')
    })

    const result = await listOrderUseCase.execute()

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NoMappedError)
    const error = result.value as NoMappedError
    expect(error.message).toBe('An unexpected error occurred')
  })
})
