import { Injectable } from '@nestjs/common'
import { Product } from '@core/domain/entities/product'
import { PrismaService } from '@adapter/driven/prisma/prisma.service'
import { PrismaProductMapper } from '@adapter/driven/mappers/prisma-product-mapper'
import { ProductRepository } from '@core/aplication/ports/repositories/product-repository'

@Injectable()
export default class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.create({
      data,
    })
  }

  async edit(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistenceUpdate(product)

    await this.prisma.product.update({
      where: { id: product.getId() },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    })
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

  async findMany(query: { category?: string }): Promise<Product[]> {
    const { category } = query

    const products = await this.prisma.product.findMany()

    if (products && category) {
      return products
        .filter((product) => product.category === category)
        .map((product) => PrismaProductMapper.toDomain(product))
    }

    return products.map((product) => PrismaProductMapper.toDomain(product))
  }
}
