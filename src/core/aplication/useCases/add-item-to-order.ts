import { Order } from '@core/domain/entities/Order'
import { OrderItem } from '@core/domain/entities/OrderItem'
import { OrderRepository } from '../repositories/order-repository'
import { ProductRepository } from '../repositories/product-repository'

export class AddItemToOrderUseCase {
  private orderRepository: OrderRepository
  private productRepository: ProductRepository

  constructor(
    orderRepository: OrderRepository,
    productRepository: ProductRepository,
  ) {
    this.orderRepository = orderRepository
    this.productRepository = productRepository
  }

  async execute(
    orderId: string,
    productId: string,
    quantity: number,
  ): Promise<Order> {
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

    return await this.orderRepository.update(order)
  }
}
