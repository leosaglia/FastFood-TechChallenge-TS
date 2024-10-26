import { PrismaOrderMapper } from '@adapter/driven/mappers/prisma-order-mapper'
import { PrismaService } from '@adapter/driven/prisma/prisma.service'
import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { Order } from '@core/domain/entities/order'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.order.create({
        data: {
          id: order.getId(),
          status: order.getStatus(),
          customerId: order.getCustomerId(),
        },
      })

      await prisma.orderItem.createMany({
        data: order.getItems().map((item) => ({
          orderId: order.getId(),
          productId: item.getProductId(),
          quantity: item.getQuantity(),
          productPrice: item.getProductPrice(),
        })),
      })
    })
  }

  async findMany(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        orderItems: true,
      },
    })

    return orders.map((order) => {
      return PrismaOrderMapper.toDomain(order, order.orderItems)
    })
  }
}
