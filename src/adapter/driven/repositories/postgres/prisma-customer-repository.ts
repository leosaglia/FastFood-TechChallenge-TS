import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { Customer } from '@core/domain/entities/Customer'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class PrismaCustomerRepository implements CustomerRepository {
  register(customer: Customer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findByDocument(document: string): Promise<Customer | null> {
    throw new Error('Method not implemented.')
  }
}
