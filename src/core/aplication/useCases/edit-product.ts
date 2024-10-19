import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { EditProductUseCaseRequest } from '../dtos/request/edit-product-use-case-request'

interface EditProductUseCaseResponse {
  product: Product
}

export class EditProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    id,
    name,
    price,
    description,
    category,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const productFound = await this.productRepository.findById(id)

    if (!productFound) {
      throw new Error('Product not found.')
    }

    const product = new Product(
      name,
      price,
      description,
      new Category(category),
      id,
    )

    this.productRepository.edit(product)

    return { product }
  }
}
