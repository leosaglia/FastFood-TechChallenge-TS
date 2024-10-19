import { Order } from '@core/domain/entities/Order'
import { OrderItem } from '@core/domain/entities/OrderItem'
import { OrderRepository } from '../repositories/order-repository'
import { ProductRepository } from '../repositories/product-repository'
import { AddItemToOrderUseCaseRequest } from '../dtos/request/add-item-to-order-use-case-request'

interface AddItemToOrderUseCaseResponse {
  order: Order
}

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
    const order = await this.orderRepository.findById(orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new Error('Product not found')
    }

    const orderItem = new OrderItem(product, quantity)
    order.addItem(orderItem)

    await this.orderRepository.update(order)

    return { order }
  }
}
