import { Order } from '@core/domain/entities/Order'

export interface OrderRepository {
  register(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
  update(order: Order): Promise<void>
}
