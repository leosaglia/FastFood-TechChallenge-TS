import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ProductRepository } from '@core/aplication/ports/repositories/product-repository'
import { OrderRepository } from '@core/aplication/ports/repositories/order-repository'
import { CustomerRepository } from '@core/aplication/ports/repositories/customer-repository'
import PrismaProductRepository from './repositories/postgres/prisma-product-repository'
import PrismaOrderRepository from './repositories/postgres/prisma-order-repository'
import PrismaCustomerRepository from './repositories/postgres/prisma-customer-repository'

@Module({
  providers: [
    PrismaService,
    { provide: ProductRepository, useClass: PrismaProductRepository },
    { provide: OrderRepository, useClass: PrismaOrderRepository },
    { provide: CustomerRepository, useClass: PrismaCustomerRepository },
  ],
  exports: [
    PrismaService,
    ProductRepository,
    OrderRepository,
    CustomerRepository,
  ],
})
export class DatabaseModule {}
