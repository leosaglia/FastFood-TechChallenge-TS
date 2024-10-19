import { Order } from '@core/domain/entities/Order'
import { OrderRepository } from '@core/aplication/repositories/order-repository'

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = []

  async register(order: Order): Promise<void> {
    this.orders.push(order)
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((order) => order.getId() === id) ?? null
  }

  async update(order: Order): Promise<void> {
    const index = this.orders.findIndex((o) => o.getId() === order.getId())
    this.orders[index] = order
  }
}
