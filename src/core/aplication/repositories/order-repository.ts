import { Order } from '@core/domain/entities/order'
import { OrderStatus } from '@core/domain/enums/order-status'

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>
  abstract findMany(): Promise<Order[]>
  abstract findById(id: string): Promise<Order | null>
  abstract updateStatus(orderId: string, newStatus: OrderStatus): Promise<void>
}
