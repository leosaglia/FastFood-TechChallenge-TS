import { CreateOrderUseCase } from '@core/aplication/useCases/create-order'
import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { InMemoryOrderRepository } from '../repositories/in-memory-order-repository'

describe('CreateOrderUseCase', () => {
  let sut: CreateOrderUseCase
  let mockOrderRepository: OrderRepository

  beforeEach(() => {
    mockOrderRepository = new InMemoryOrderRepository()
    sut = new CreateOrderUseCase(mockOrderRepository)
  })

  it('should create a new order', async () => {
    const order = await sut.execute()

    expect(order).toBeDefined()
    expect(order.getId()).toBeDefined()
    expect(order.getItems()).toHaveLength(0)
    expect(order.getStatus()).toBe('Criado')
  })
})
