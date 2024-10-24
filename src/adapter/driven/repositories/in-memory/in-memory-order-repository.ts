import { Order } from '@core/domain/entities/Order'
import { OrderRepository } from '@core/aplication/repositories/order-repository'

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = []

  async register(order: Order): Promise<void> {
    this.orders.push(order)
  }

  async list(): Promise<Order[]> {
    return this.orders
  }
}
