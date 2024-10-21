import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import PrismaProductRepository from './repositories/postgres/prisma-product-repository'
import { ProductRepository } from '@core/aplication/repositories/product-repository'

@Module({
  providers: [
    PrismaService,
    { provide: ProductRepository, useClass: PrismaProductRepository },
  ],
  exports: [PrismaService, ProductRepository],
})
export class DatabaseModule {}
