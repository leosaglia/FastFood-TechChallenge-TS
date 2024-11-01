import { ProductRepository } from '@core/aplication/ports/repositories/product-repository'
import { DeleteProductUseCase } from '@core/aplication/useCases/delete-product'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestDeleteProductUseCase extends DeleteProductUseCase {
  constructor(productRepository: ProductRepository) {
    super(productRepository)
  }
}
