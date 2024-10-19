import { Order } from '@core/domain/entities/Order'
import { OrderRepository } from '../repositories/order-repository'
import { Either, failure, success } from '@core/error-handling/Either'
import { NoMappedError } from '@core/error-handling/no-mapped-error'

type CreateOrderUseCaseResponse = Either<
  NoMappedError,
  {
    order: Order
  }
>

export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(): Promise<CreateOrderUseCaseResponse> {
    try {
      const order = new Order()
      await this.orderRepository.register(order)
      return success({ order })
    } catch (error) {
      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
