import { Product } from '@core/domain/entities/product'

export class ProductPresenter {
  static present(product: Product) {
    return {
      id: product.getId(),
      name: product.getName(),
      description: product.getDescription(),
      category: product.getCategory(),
      price: product.getPrice().toFixed(2),
    }
  }
}
