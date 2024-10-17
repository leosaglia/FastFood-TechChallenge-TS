import { ProductRepository } from '@core/aplication/repositories/product-repository'

export class DeleteProductUseCase {
  private productRepository: ProductRepository

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository
  }

  async execute(productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    await this.productRepository.delete(productId)
  }
}
