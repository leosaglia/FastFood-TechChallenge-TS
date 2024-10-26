import { Order } from '@core/domain/entities/order'

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>
  abstract findMany(): Promise<Order[]>
}
