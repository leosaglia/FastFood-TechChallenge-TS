import { OrderRepository } from '@core/aplication/ports/repositories/order-repository'
import { ProductRepository } from '@core/aplication/ports/repositories/product-repository'
import { CustomerRepository } from '@core/aplication/ports/repositories/customer-repository'
import { CreateOrderUseCase } from '@core/aplication/useCases/create-order'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestCreateOrderUseCase extends CreateOrderUseCase {
  constructor(
    orderRepository: OrderRepository,
    productRepository: ProductRepository,
    customerRepository: CustomerRepository,
  ) {
    super(orderRepository, productRepository, customerRepository)
  }
}
