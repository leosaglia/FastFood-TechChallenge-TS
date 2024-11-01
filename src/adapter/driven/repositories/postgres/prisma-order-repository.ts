import { PrismaOrderMapper } from '@adapter/driven/mappers/prisma-order-mapper'
import { PrismaService } from '@adapter/driven/prisma/prisma.service'
import { OrderRepository } from '@core/aplication/ports/repositories/order-repository'
import { Order } from '@core/domain/entities/order'
import { OrderStatus } from '@core/domain/enums/order-status'
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

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: true,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order, order.orderItems)
  }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    })
  }
}
