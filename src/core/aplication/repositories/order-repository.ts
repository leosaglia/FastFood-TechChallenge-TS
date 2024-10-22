import { Order } from '@core/domain/entities/Order'

export abstract class OrderRepository {
  abstract register(order: Order): Promise<void>
  abstract findById(id: string): Promise<Order | null>
  abstract update(order: Order): Promise<void>
  abstract list(): Promise<Order[]>
}
