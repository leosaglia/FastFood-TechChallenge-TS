import { OrderStatus } from '@core/domain/enums/order-status'
import { CreateOrderUseCase } from '@core/aplication/useCases/create-order'
import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { InMemoryOrderRepository } from '../repositories/in-memory-order-repository'
import { Order } from '@core/domain/entities/Order'

describe('CreateOrderUseCase', () => {
  let sut: CreateOrderUseCase
  let mockOrderRepository: OrderRepository

  beforeEach(() => {
    mockOrderRepository = new InMemoryOrderRepository()
    sut = new CreateOrderUseCase(mockOrderRepository)
  })

  it('should create a new order', async () => {
    const result = await sut.execute()
    const { order } = result.value as { order: Order }
    const creationDate = order.getCreatedAt()
    const now = new Date()
    const timeDifference = now.getTime() - creationDate.getTime()

    expect(result.isSuccess()).toBe(true)
    expect(order).toBeDefined()
    expect(order.getId()).toBeDefined()
    expect(order.getItems()).toHaveLength(0)
    expect(order.getStatus()).toBe(OrderStatus.CREATED)
    expect(creationDate).toBeInstanceOf(Date)
    expect(order.getUpdatedAt()).toBeInstanceOf(Date)
    expect(timeDifference).toBeLessThan(1000)
  })
})
