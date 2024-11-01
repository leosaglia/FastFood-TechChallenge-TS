import { Order } from '@core/domain/entities/order'
import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { OrderStatus } from '@core/domain/enums/order-status'

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = []

  async create(order: Order): Promise<void> {
    this.orders.push(order)
  }

  async findMany(): Promise<Order[]> {
    return this.orders
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((order) => order.getId() === id) || null
  }

  async updateStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
    const orderIndex = this.orders.findIndex((o) => o.getId() === orderId)

    if (orderIndex === -1) {
      return
    }

    this.orders[orderIndex].setStatus(newStatus)
  }
}
