import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { FindProductsByCategoryUseCase } from '@core/aplication/useCases/find-products-by-category'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFindProductsByCategoryUseCase extends FindProductsByCategoryUseCase {
  constructor(productRepository: ProductRepository) {
    super(productRepository)
  }
}
