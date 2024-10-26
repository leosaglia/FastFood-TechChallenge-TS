import { Customer } from '@core/domain/entities/customer'
import { Document } from '@core/domain/valueObjects/document'
import { Customer as PrismaCustomer } from '@prisma/client'

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    return new Customer(raw.name, new Document(raw.document), raw.email, raw.id)
  }
}
