import { Order } from '@core/domain/entities/Order'
import { OrderRepository } from '../repositories/order-repository'
import { Either, failure, success } from '@core/error-handling/either'
import { NoMappedError } from '@core/error-handling/no-mapped-error'
import { CreateOrderUseCaseRequest } from '../dtos/request/create-order-use-case-request'
import { ProductRepository } from '../repositories/product-repository'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { OrderItem } from '@core/domain/entities/OrderItem'

type CreateOrderUseCaseResponse = Either<
  NoMappedError | BadRequestError,
  {
    order: Order
  }
>

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute({
    items,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    try {
      const order = new Order()

      if (items.length === 0) {
        return failure(
          new BadRequestError('You must pass products to create an order'),
        )
      }

      for (const item of items) {
        const product = await this.productRepository.findById(item.productId)
        if (!product) {
          return failure(new BadRequestError('Product not found'))
        }

        const orderItem = new OrderItem(
          item.productId,
          order.getId(),
          product.getPrice(),
          item.quantity,
        )
        order.addItem(orderItem)
      }

      await this.orderRepository.register(order)

      return success({ order })
    } catch (error) {
      if (error instanceof BadRequestError) {
        return failure(error)
      }
      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
