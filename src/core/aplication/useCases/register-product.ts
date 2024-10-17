import { Product } from '@core/domain/entities/Product'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { Category } from '@core/domain/enums/Category'
import { Decimal } from 'decimal.js'
import { RegisterProductDto } from '@core/aplication/dtos/register-product-dto'

export class RegisterProductUseCase {
  private productRepository: ProductRepository

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository
  }

  async execute(dto: RegisterProductDto): Promise<Product> {
    const product = new Product(
      dto.name,
      new Decimal(dto.price),
      dto.description,
      dto.category as Category,
    )

    return await this.productRepository.register(product)
  }
}
