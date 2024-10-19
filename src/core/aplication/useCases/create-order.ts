import { Order } from '@core/domain/entities/Order'
import { OrderRepository } from '../repositories/order-repository'

export class CreateOrderUseCase {
  private orderRepository: OrderRepository

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository
  }

  async execute(): Promise<Order> {
    const order = new Order()
    await this.orderRepository.register(order)
    return order
  }
}
