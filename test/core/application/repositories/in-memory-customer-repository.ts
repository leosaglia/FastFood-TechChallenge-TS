import { Customer } from '@core/domain/entities/Customer'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'

export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Customer[] = []

  async findByDocument(document: string): Promise<Customer | null> {
    return (
      this.customers.find(
        (customer) => customer.document.getValue() === document,
      ) || null
    )
  }

  async register(customer: Customer): Promise<Customer> {
    this.customers.push(customer)
    return customer
  }
}
