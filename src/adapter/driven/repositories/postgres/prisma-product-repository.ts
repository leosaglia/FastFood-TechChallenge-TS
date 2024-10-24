import { Injectable } from '@nestjs/common'
import { Product } from '@core/domain/entities/Product'
import { PrismaService } from '@adapter/driven/prisma/prisma.service'
import { PrismaProductMapper } from '@adapter/driven/mappers/prisma-product-mapper'
import { ProductRepository } from '@core/aplication/repositories/product-repository'

@Injectable()
export default class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async register(product: Product): Promise<void> {
    await this.prisma.product.create({
      data: {
        id: product.getId(),
        name: product.getName(),
        description: product.getDescription(),
        price: product.getPrice(),
        category: product.getCategory(),
      },
    })
  }

  async edit(product: Product): Promise<void> {
    await this.prisma.product.update({
      where: { id: product.getId() },
      data: {
        name: product.getName(),
        description: product.getDescription(),
        price: product.getPrice(),
        category: product.getCategory(),
      },
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
