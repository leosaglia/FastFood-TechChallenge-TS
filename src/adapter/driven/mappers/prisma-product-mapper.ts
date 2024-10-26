import { Product } from '@core/domain/entities/product'
import { Category } from '@core/domain/valueObjects/category'
import { Prisma, Product as PrismaProduct } from '@prisma/client'

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return new Product(
      raw.name,
      raw.price,
      raw.description,
      new Category(raw.category),
      raw.id,
    )
  }

  static toPersistence(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.getId(),
      name: product.getName(),
      description: product.getDescription(),
      price: product.getPrice(),
      category: product.getCategory(),
    }
  }

  static toPersistenceUpdate(product: Product): Prisma.ProductUpdateInput {
    return {
      name: product.getName(),
      description: product.getDescription(),
      price: product.getPrice(),
      category: product.getCategory(),
    }
  }
}
