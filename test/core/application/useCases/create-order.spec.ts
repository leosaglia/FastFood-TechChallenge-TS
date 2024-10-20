import { OrderStatus } from '@core/domain/enums/order-status'
import { CreateOrderUseCase } from '@core/aplication/useCases/create-order'
import { Order } from '@core/domain/entities/Order'
import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { InMemoryOrderRepository } from '../repositories/in-memory-order-repository'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { InMemoryProductRepository } from '../repositories/in-memory-product-repository'
import { makeProduct } from '@test/factories/product-factory'
import { BadRequestError } from '@core/error-handling/bad-request-error'

describe('CreateOrderUseCase', () => {
  let sut: CreateOrderUseCase
  let mockOrderRepository: OrderRepository
  let mockProductRepository: ProductRepository

  beforeEach(() => {
    mockOrderRepository = new InMemoryOrderRepository()
    mockProductRepository = new InMemoryProductRepository()
    sut = new CreateOrderUseCase(mockOrderRepository, mockProductRepository)
  })

  it('should create a new order with products', async () => {
    mockProductRepository.register(makeProduct({ id: '1' }))
    mockProductRepository.register(makeProduct({ id: '2' }))
    const result = await sut.execute({
      items: [
        {
          productId: '1',
          quantity: 1,
        },
        {
          productId: '2',
          quantity: 1,
        },
      ],
    })

    expect(result.isSuccess()).toBe(true)

    const { order } = result.value as { order: Order }
    const creationDate = order.getCreatedAt()
    const now = new Date()
    const timeDifference = now.getTime() - creationDate.getTime()

    expect(result.isSuccess()).toBe(true)
    expect(order).toBeDefined()
    expect(order.getId()).toBeDefined()
    expect(order.getItems()).toHaveLength(2)
    expect(order.getItems()[0].getProductId().getValue()).toBe('1')
    expect(order.getItems()[1].getProductId().getValue()).toBe('2')
    expect(order.getStatus()).toBe(OrderStatus.CREATED)
    expect(creationDate).toBeInstanceOf(Date)
    expect(order.getUpdatedAt()).toBeInstanceOf(Date)
    expect(timeDifference).toBeLessThan(1000)
  })

  it('should agrupe products when duplicated in same order', async () => {
    mockProductRepository.register(makeProduct({ id: '1' }))
    const result = await sut.execute({
      items: [
        {
          productId: '1',
          quantity: 1,
        },
        {
          productId: '1',
          quantity: 5,
        },
      ],
    })

    expect(result.isSuccess()).toBe(true)

    const { order } = result.value as { order: Order }
    expect(order.getItems()).toHaveLength(1)
    expect(order.getItems()[0].getProductId().getValue()).toBe('1')
    expect(order.getItems()[0].getQuantity()).toBe(6)
  })

  it('should return an error when no products are passed', async () => {
    const result = await sut.execute({
      items: [],
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(BadRequestError)
    const error = result.value as BadRequestError
    expect(error.message).toBe('You must pass products to create an order')
  })

  it('should return an error when a product is not found', async () => {
    const result = await sut.execute({
      items: [
        {
          productId: '1',
          quantity: 1,
        },
      ],
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(BadRequestError)
    const error = result.value as BadRequestError
    expect(error.message).toBe('Product not found')
  })
})
