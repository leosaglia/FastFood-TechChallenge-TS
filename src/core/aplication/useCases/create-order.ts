import { Order } from '@core/domain/entities/Order'
import { OrderItem } from '@core/domain/entities/OrderItem'
import { OrderRepository } from '../repositories/order-repository'
import { ProductRepository } from '../repositories/product-repository'
import { CustomerRepository } from '../repositories/customer-repository'
import { CreateOrderUseCaseRequest } from '../dtos/request/create-order-use-case-request'
import { Either, failure, success } from '@core/error-handling/either'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'

type CreateOrderUseCaseResponse = Either<
  NoMappedError | BadRequestError | ResourceNotFoundError,
  {
    order: Order
  }
>

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute({
    items,
    customerId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    try {
      const order = new Order()

      if (items.length === 0) {
        return failure(
          new BadRequestError('You must pass products to create an order'),
        )
      }

      if (customerId) {
        const customer = await this.customerRepository.findById(customerId)

        if (!customer) {
          return failure(new ResourceNotFoundError('Customer not found'))
        }

        order.setCustomerId(customerId)
      }

      for (const item of items) {
        const product = await this.productRepository.findById(item.productId)
        if (!product) {
          return failure(new ResourceNotFoundError('Product not found'))
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
