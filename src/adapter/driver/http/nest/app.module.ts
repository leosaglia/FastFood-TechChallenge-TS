import { Module } from '@nestjs/common'
import { ProductController } from '../controllers/product.controller'
import { DatabaseModule } from '@adapter/driven/database.module'
import { NestRegisterProductUseCase } from './use-cases/nest-register-product-use-case'

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [NestRegisterProductUseCase],
})
export class AppModule {}
