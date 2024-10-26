import { Customer } from '@core/domain/entities/customer'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'

export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Customer[] = []

  async findById(customerId: string): Promise<Customer | null> {
    return (
      this.customers.find((customer) => customer.getId() === customerId) || null
    )
  }

  async findByDocument(document: string): Promise<Customer | null> {
    return (
      this.customers.find((customer) => customer.getDocument() === document) ||
      null
    )
  }

  async create(customer: Customer): Promise<void> {
    this.customers.push(customer)
  }
}
