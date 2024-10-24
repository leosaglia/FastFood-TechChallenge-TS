import { Module } from '@nestjs/common'
import { ProductController } from '../controllers/product.controller'
import { CustomerController } from '../controllers/customer.controller'
import { DatabaseModule } from '@adapter/driven/database.module'
import { NestIdentifyCustomerByDocumentUseCase } from './use-cases/nest-identify-customer-by-document'
import { NestRegisterCustomerUseCase } from './use-cases/nest-register-customer'
import { NestRegisterProductUseCase } from './use-cases/nest-register-product'
import { NestEditProductUseCase } from './use-cases/nest-edit-product'
import { NestDeleteProductUseCase } from './use-cases/nest-delete-product'
import { NestFindProductsUseCase } from './use-cases/nest-find-products'
import { NestCreateOrderUseCase } from './use-cases/nest-create-order'
import { NestListOrderUseCase } from './use-cases/nest-list-orders'

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController, CustomerController],
  providers: [
    NestIdentifyCustomerByDocumentUseCase,
    NestRegisterCustomerUseCase,
    NestRegisterProductUseCase,
    NestEditProductUseCase,
    NestDeleteProductUseCase,
    NestFindProductsUseCase,
    NestCreateOrderUseCase,
    NestListOrderUseCase,
  ],
})
export class AppModule {}
