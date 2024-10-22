import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { Order } from '@core/domain/entities/Order'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class PrismaOrderRepository implements OrderRepository {
  register(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.')
  }

  update(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  list(): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }
}
