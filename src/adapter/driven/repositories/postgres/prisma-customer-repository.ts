import { Injectable } from '@nestjs/common'
import { Customer } from '@core/domain/entities/Customer'
import { PrismaService } from '@adapter/driven/prisma/prisma.service'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { PrismaCustomerMapper } from '@adapter/driven/mappers/prisma-customer-mapper'

@Injectable()
export default class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async register(customer: Customer): Promise<void> {
    await this.prisma.customer.create({
      data: {
        id: customer.getId(),
        name: customer.getName(),
        email: customer.getEmail(),
        document: customer.getDocument(),
      },
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
}