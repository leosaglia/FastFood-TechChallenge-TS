import { Order } from '@core/domain/entities/order'
import { Product } from '@core/domain/entities/product'

interface OrderItemDTO {
  productId: string
  name?: string
  price?: string
  category?: string
  quantity: number
  total: string
}

interface OrderDTO {
  id: string
  status: string
  items: OrderItemDTO[]
  customerId?: string
  createdAt: string
  total: string
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
        price: product?.getPrice().toFixed(2),
        category: product?.getCategory(),
        quantity: item.getQuantity(),
        total: item.getTotal().toFixed(2),
      }
    })

    return {
      id: order.getId(),
      customerId: order.getCustomerId(),
      status: order.getStatus(),
      items: orderItems,
      total: order.getTotal().toFixed(2),
      createdAt: order.getCreatedAt().toISOString(),
    }
  }
}
