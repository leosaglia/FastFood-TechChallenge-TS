import { Order } from '@core/domain/entities/Order'
import { OrderRepository } from '../repositories/order-repository'

interface CreateOrderUseCaseResponse {
  order: Order
}

export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(): Promise<CreateOrderUseCaseResponse> {
    const order = new Order()
    await this.orderRepository.register(order)
    return { order }
  }
}
