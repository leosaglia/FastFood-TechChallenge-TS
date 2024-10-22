import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { EditProductUseCase } from '@core/aplication/useCases/edit-product'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestEditProductUseCase extends EditProductUseCase {
  constructor(productRepository: ProductRepository) {
    super(productRepository)
  }
}
