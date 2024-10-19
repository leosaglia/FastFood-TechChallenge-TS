import { Order } from '@core/domain/entities/Order'
import { OrderItem } from '@core/domain/entities/OrderItem'
import { OrderRepository } from '../repositories/order-repository'
import { ProductRepository } from '../repositories/product-repository'
import { AddItemToOrderUseCaseRequest } from '../dtos/request/add-item-to-order-use-case-request'
import { Either, failure, success } from '@core/error-handling/Either'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'

type AddItemToOrderUseCaseResponse = Either<
  NoMappedError | ResourceNotFoundError,
  {
    order: Order
  }
>

export class AddItemToOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute({
    orderId,
    productId,
    quantity,
  }: AddItemToOrderUseCaseRequest): Promise<AddItemToOrderUseCaseResponse> {
    try {
      const order = await this.orderRepository.findById(orderId)
      if (!order) {
        return failure(new ResourceNotFoundError('Order not found'))
      }

      const product = await this.productRepository.findById(productId)
      if (!product) {
        return failure(new ResourceNotFoundError('Product not found'))
      }

      const orderItem = new OrderItem(product, quantity)
      order.addItem(orderItem)

      await this.orderRepository.update(order)

      return success({ order })
    } catch (error) {
      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
