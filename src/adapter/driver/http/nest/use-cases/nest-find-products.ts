import { ProductRepository } from '@core/aplication/ports/repositories/product-repository'
import { FindProductsUseCase } from '@core/aplication/useCases/find-products'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFindProductsUseCase extends FindProductsUseCase {
  constructor(productRepository: ProductRepository) {
    super(productRepository)
  }
}
