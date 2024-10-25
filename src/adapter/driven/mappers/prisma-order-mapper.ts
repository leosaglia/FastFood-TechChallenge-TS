import { Order } from '@core/domain/entities/Order'
import { OrderItem } from '@core/domain/entities/OrderItem'
import { OrderStatus } from '@core/domain/enums/order-status'
import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from '@prisma/client'
import Decimal from 'decimal.js'

export class PrismaOrderMapper {
  static toDomain(
    prismaOrder: PrismaOrder,
    prismaOrderItems: PrismaOrderItem[],
  ): Order {
    const { id, status, customerId, createdAt, updatedAt } = prismaOrder

    const orderItems = prismaOrderItems.map((item) => {
      const { productId, productPrice, quantity } = item
      return new OrderItem(productId, id, new Decimal(productPrice), quantity)
    })

    return new Order(
      id,
      status as OrderStatus,
      customerId ?? undefined,
      orderItems,
      createdAt,
      updatedAt,
    )
  }
}
