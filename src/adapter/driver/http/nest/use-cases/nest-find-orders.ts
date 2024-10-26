import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { FindOrdersUseCase } from '@core/aplication/useCases/find-orders'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFindOrdersUseCase extends FindOrdersUseCase {
  constructor(
    orderRepository: OrderRepository,
    productRepository: ProductRepository,
  ) {
    super(orderRepository, productRepository)
  }
}
