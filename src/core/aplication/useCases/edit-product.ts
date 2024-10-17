import { Product } from '@core/domain/entities/Product'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { EditProductDto } from '@core/aplication/dtos/edit-product-dto'
import { Category } from '@core/domain/enums/Category'

export class EditProductUseCase {
  private productRepository: ProductRepository

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository
  }

  async execute(dto: EditProductDto): Promise<Product> {
    const productFound = await this.productRepository.findById(dto.id)

    if (!productFound) {
      throw new Error('Product not found.')
    }

    const product = new Product(
      dto.name,
      dto.price,
      dto.description,
      dto.category as Category,
      dto.id,
    )

    return this.productRepository.edit(product)
  }
}
