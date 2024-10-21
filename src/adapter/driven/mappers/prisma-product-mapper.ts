import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
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
