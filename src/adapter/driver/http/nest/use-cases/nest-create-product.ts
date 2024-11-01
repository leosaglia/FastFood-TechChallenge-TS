import { ProductRepository } from '@core/aplication/ports/repositories/product-repository'
import { CreateProductUseCase } from '@core/aplication/useCases/create-product'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestCreateProductUseCase extends CreateProductUseCase {
  constructor(productRepository: ProductRepository) {
    super(productRepository)
  }
}
