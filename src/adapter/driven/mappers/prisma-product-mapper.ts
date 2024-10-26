import { Product } from '@core/domain/entities/product'
import { Category } from '@core/domain/valueObjects/category'
import { Product as PrismaProduct } from '@prisma/client'

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
}
