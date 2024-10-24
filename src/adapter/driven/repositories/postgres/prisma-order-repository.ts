import { PrismaService } from '@adapter/driven/prisma/prisma.service'
import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { Order } from '@core/domain/entities/Order'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async register(order: Order): Promise<void> {
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

  list(): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }
}
