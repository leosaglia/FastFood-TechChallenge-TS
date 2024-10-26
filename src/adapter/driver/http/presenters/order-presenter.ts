import { Order } from '@core/domain/entities/order'
import { Product } from '@core/domain/entities/product'
import { ApiProperty } from '@nestjs/swagger'

class OrderItemPresenter {
  @ApiProperty({ example: '1a442d43-fad4-47ad-91ce-485346ad5a05' })
  private readonly productId: string

  @ApiProperty({ example: 'Burguer Bacon' })
  private readonly name?: string

  @ApiProperty({ example: '10.00' })
  private readonly price?: string

  @ApiProperty({ example: 'Lanche' })
  private readonly category?: string

  @ApiProperty({ example: 2 })
  private readonly quantity: number

  @ApiProperty({ example: '20.00' })
  private readonly total: string

  constructor(
    productId: string,
    quantity: number,
    total: string,
    name?: string,
    price?: string,
    category?: string,
  ) {
    this.productId = productId
    this.name = name
    this.price = price
    this.category = category
    this.quantity = quantity
    this.total = total
  }
}

export class OrderPresenter {
  @ApiProperty({ example: '1a442d43-fad4-47ad-91ce-485346ad5a05' })
  private readonly id: string

  @ApiProperty({ example: '1a442d43-fad4-47ad-91ce-485346ad5a05' })
  private readonly customerId?: string

  @ApiProperty({ example: 'criado' })
  private readonly status: string

  @ApiProperty({ example: '10.00' })
  private readonly total: string

  @ApiProperty({ example: '2021-06-01T00:00:00Z' })
  private readonly createdAt: string

  @ApiProperty({ type: [OrderItemPresenter] })
  private readonly items: OrderItemPresenter[]

  constructor(
    id: string,
    status: string,
    total: string,
    createdAt: string,
    items: OrderItemPresenter[],
    customerId?: string,
  ) {
    this.id = id
    this.customerId = customerId
    this.status = status
    this.total = total
    this.createdAt = createdAt
    this.items = items
  }

  static present(order: Order, products: Product[]): OrderPresenter {
    const orderItems = order.getItems().map((item) => {
      const product = products.find(
        (product) => product.getId() === item.getProductId(),
      )

      return new OrderItemPresenter(
        item.getProductId(),
        item.getQuantity(),
        item.getTotal().toFixed(2),
        product?.getName(),
        product?.getPrice().toFixed(2),
        product?.getCategory(),
      )
    })

    return new OrderPresenter(
      order.getId(),
      order.getStatus(),
      order.getTotal().toFixed(2),
      order.getCreatedAt().toISOString(),
      orderItems,
      order.getCustomerId(),
    )
  }
}
