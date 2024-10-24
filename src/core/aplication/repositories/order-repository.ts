import { Order } from '@core/domain/entities/Order'

export abstract class OrderRepository {
  abstract register(order: Order): Promise<void>
  abstract list(): Promise<Order[]>
}
