import { Decimal } from 'decimal.js'

import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { RegisterProductUseCaseRequest } from '../dtos/request/register-product-use-case-request'

interface RegisterProductUseCaseResponse {
  product: Product
}

export class RegisterProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    name,
    price,
    description,
    category,
  }: RegisterProductUseCaseRequest): Promise<RegisterProductUseCaseResponse> {
    const product = new Product(
      name,
      new Decimal(price),
      description,
      new Category(category),
    )

    await this.productRepository.register(product)

    return { product }
  }
}
