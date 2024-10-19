import { Decimal } from 'decimal.js'

import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { RegisterProductDto } from '@core/aplication/dtos/register-product-dto'
import { ProductRepository } from '@core/aplication/repositories/product-repository'

export class RegisterProductUseCase {
  private productRepository: ProductRepository

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository
  }

  async execute(dto: RegisterProductDto): Promise<Product> {
    const category = new Category(dto.category)
    const product = new Product(
      dto.name,
      new Decimal(dto.price),
      dto.description,
      category,
    )

    return await this.productRepository.register(product)
  }
}
