import { Injectable } from '@nestjs/common'
import { Customer } from '@core/domain/entities/customer'
import { PrismaService } from '@adapter/driven/prisma/prisma.service'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { PrismaCustomerMapper } from '@adapter/driven/mappers/prisma-customer-mapper'

@Injectable()
export default class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPersistence(customer)

    await this.prisma.customer.create({
      data,
    })
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { document },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async findById(customerId: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }
}
