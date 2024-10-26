import { Customer } from '@core/domain/entities/customer'
import { Document } from '@core/domain/valueObjects/document'
import { Prisma, Customer as PrismaCustomer } from '@prisma/client'

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    return new Customer(raw.name, new Document(raw.document), raw.email, raw.id)
  }

  static toPersistence(
    customer: Customer,
  ): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.getId(),
      name: customer.getName(),
      email: customer.getEmail(),
      document: customer.getDocument(),
    }
  }
}
