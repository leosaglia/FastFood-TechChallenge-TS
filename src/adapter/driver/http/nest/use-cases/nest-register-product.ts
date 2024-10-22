import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { RegisterProductUseCase } from '@core/aplication/useCases/register-product'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRegisterProductUseCase extends RegisterProductUseCase {
  constructor(productRepository: ProductRepository) {
    super(productRepository)
  }
}
