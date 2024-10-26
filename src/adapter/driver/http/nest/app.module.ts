import { Module } from '@nestjs/common'
import { ProductController } from '../controllers/product.controller'
import { CustomerController } from '../controllers/customer.controller'
import { OrderController } from '../controllers/order.controller'
import { DatabaseModule } from '@adapter/driven/database.module'
import { NestIdentifyCustomerByDocumentUseCase } from './use-cases/nest-identify-customer-by-document'
import { NestCreateCustomerUseCase } from './use-cases/nest-create-customer'
import { NestCreateProductUseCase } from './use-cases/nest-create-product'
import { NestEditProductUseCase } from './use-cases/nest-edit-product'
import { NestDeleteProductUseCase } from './use-cases/nest-delete-product'
import { NestFindProductsUseCase } from './use-cases/nest-find-products'
import { NestCreateOrderUseCase } from './use-cases/nest-create-order'
import { NestFindOrdersUseCase } from './use-cases/nest-find-orders'

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController, CustomerController, OrderController],
  providers: [
    NestIdentifyCustomerByDocumentUseCase,
    NestCreateCustomerUseCase,
    NestCreateProductUseCase,
    NestEditProductUseCase,
    NestDeleteProductUseCase,
    NestFindProductsUseCase,
    NestCreateOrderUseCase,
    NestFindOrdersUseCase,
  ],
})
export class AppModule {}
