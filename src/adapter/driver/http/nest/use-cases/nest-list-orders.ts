import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { ListOrderUseCase } from '@core/aplication/useCases/list-orders'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestListOrderUseCase extends ListOrderUseCase {
  constructor(
    orderRepository: OrderRepository,
    productRepository: ProductRepository,
  ) {
    super(orderRepository, productRepository)
  }
}
