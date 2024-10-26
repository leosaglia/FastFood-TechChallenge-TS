import { Order } from '@core/domain/entities/order'
import { OrderRepository } from '@core/aplication/repositories/order-repository'

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = []

  async create(order: Order): Promise<void> {
    this.orders.push(order)
  }

  async findMany(): Promise<Order[]> {
    return this.orders
  }
}
