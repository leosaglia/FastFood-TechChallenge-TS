import { Order } from '@core/domain/entities/Order'
import { Product } from '@core/domain/entities/Product'
import Decimal from 'decimal.js'

interface OrderItemDTO {
  productId: string
  name?: string
  price?: Decimal
  category?: string
  quantity: number
  total: Decimal
}

interface OrderDTO {
  id: string
  status: string
  items: OrderItemDTO[]
  customerId?: string
  createdAt: string
  total: Decimal
}

export class OrderPresenter {
  static present(order: Order, products: Product[]): OrderDTO {
    const orderItems = order.getItems().map((item) => {
      const product = products.find(
        (product) => product.getId() === item.getProductId(),
      )

      return {
        productId: item.getProductId(),
        name: product?.getName(),
        price: product?.getPrice(),
        category: product?.getCategory(),
        quantity: item.getQuantity(),
        total: item.getTotal(),
      }
    })

    return {
      id: order.getId(),
      status: order.getStatus(),
      items: orderItems,
      customerId: order.getCustomerId(),
      createdAt: order.getCreatedAt().toISOString(),
      total: order.getTotal(),
    }
  }
}
