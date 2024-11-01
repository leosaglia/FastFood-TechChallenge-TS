import { OrderStatus } from '@core/domain/enums/order-status'
import { CreateOrderUseCase } from '@core/aplication/useCases/create-order'
import { Order } from '@core/domain/entities/order'
import { Product } from '@core/domain/entities/product'
import { OrderRepository } from '@core/aplication/ports/repositories/order-repository'
import { InMemoryOrderRepository } from '@adapter/driven/repositories/in-memory/in-memory-order-repository'
import { ProductRepository } from '@core/aplication/ports/repositories/product-repository'
import { InMemoryProductRepository } from '@adapter/driven/repositories/in-memory/in-memory-product-repository'
import { CustomerRepository } from '@core/aplication/ports/repositories/customer-repository'
import { InMemoryCustomerRepository } from '@adapter/driven/repositories/in-memory/in-memory-customer-repository'
import { makeProduct } from '@test/factories/product-factory'
import { makeCustomer } from '@test/factories/customer-factory'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'

describe('CreateOrderUseCase', () => {
  let sut: CreateOrderUseCase
  let mockOrderRepository: OrderRepository
  let mockProductRepository: ProductRepository
  let mockCustomerRepository: CustomerRepository

  beforeEach(() => {
    mockOrderRepository = new InMemoryOrderRepository()
    mockProductRepository = new InMemoryProductRepository()
    mockCustomerRepository = new InMemoryCustomerRepository()
    sut = new CreateOrderUseCase(
      mockOrderRepository,
      mockProductRepository,
      mockCustomerRepository,
    )
  })

  it('should create a new order with products', async () => {
    mockProductRepository.create(makeProduct({ id: '1' }))
    mockProductRepository.create(makeProduct({ id: '2' }))
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

    const { order, products } = result.value as {
      order: Order
      products: Product[]
    }
    const creationDate = order.getCreatedAt()
    const now = new Date()
    const timeDifference = now.getTime() - creationDate.getTime()

    expect(result.isSuccess()).toBe(true)
    expect(order).toBeDefined()
    expect(order.getId()).toBeDefined()
    expect(order.getItems()).toHaveLength(2)
    expect(order.getItems()[0].getProductId()).toBe('1')
    expect(order.getItems()[1].getProductId()).toBe('2')
    expect(order.getStatus()).toBe(OrderStatus.CREATED)
    expect(creationDate).toBeInstanceOf(Date)
    expect(order.getUpdatedAt()).toBeInstanceOf(Date)
    expect(timeDifference).toBeLessThan(1000)

    expect(products).toHaveLength(2)
    expect(products[0].getId()).toBe('1')
    expect(products[1].getId()).toBe('2')
  })

  it('should create a new order with customer', async () => {
    mockProductRepository.create(makeProduct({ id: '1' }))
    mockCustomerRepository.create(makeCustomer({ id: '1' }))
    const result = await sut.execute({
      items: [
        {
          productId: '1',
          quantity: 1,
        },
      ],
      customerId: '1',
    })

    expect(result.isSuccess()).toBe(true)

    const { order } = result.value as { order: Order }
    expect(order.getCustomerId()).toBe('1')
  })

  it('should agrupe products when duplicated in same order', async () => {
    mockProductRepository.create(makeProduct({ id: '1' }))
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
    expect(order.getItems()[0].getProductId()).toBe('1')
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
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    const error = result.value as ResourceNotFoundError
    expect(error.message).toBe('Product not found')
  })

  it('should return an error when a customer is not found', async () => {
    mockProductRepository.create(makeProduct({ id: '1' }))
    const result = await sut.execute({
      items: [
        {
          productId: '1',
          quantity: 1,
        },
      ],
      customerId: '1',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    const error = result.value as ResourceNotFoundError
    expect(error.message).toBe('Customer not found')
  })
})
