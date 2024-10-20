import { Module } from '@nestjs/common'
import { ProductController } from './controllers/product.controller'
import { PrismaService } from '@adapter/driven/prisma/prisma.service'

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [PrismaService],
})
export class AppModule {}
