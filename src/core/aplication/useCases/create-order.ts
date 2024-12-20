import { Order } from '@core/domain/entities/order'
import { Product } from '@core/domain/entities/product'
import { OrderItem } from '@core/domain/entities/orderItem'
import { OrderRepository } from '../ports/repositories/order-repository'
import { ProductRepository } from '../ports/repositories/product-repository'
import { CustomerRepository } from '../ports/repositories/customer-repository'
import { CreateOrderUseCaseRequest } from '../dtos/request/create-order-use-case-request'
import { Either, failure, success } from '@core/error-handling/either'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'

type CreateOrderUseCaseResponse = Either<
  NoMappedError | BadRequestError | ResourceNotFoundError,
  {
    order: Order
    products: Product[]
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
      const products: Product[] = []

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

        products.push(product)

        const orderItem = new OrderItem(
          item.productId,
          order.getId(),
          product.getPrice(),
          item.quantity,
        )
        order.addItem(orderItem)
      }

      await this.orderRepository.create(order)

      return success({ order, products })
    } catch (error) {
      if (error instanceof BadRequestError) {
        return failure(error)
      }
      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
