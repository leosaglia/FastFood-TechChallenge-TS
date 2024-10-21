import { PrismaProductMapper } from '@adapter/driven/mappers/prisma-product-mapper'
import { PrismaService } from '@adapter/driven/prisma/prisma.service'
import { ProductRepository } from '@core/aplication/repositories/product-repository'
import { Product } from '@core/domain/entities/Product'
import { Category } from '@core/domain/valueObjects/Category'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async register(product: Product): Promise<void> {
    await this.prisma.product.create({
      data: {
        name: product.getName(),
        description: product.getDescription(),
        price: product.getPrice(),
        category: product.getCategory().getValue(),
      },
    })
  }

  edit(product: Product): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  findByCategory(category: Category): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
}
