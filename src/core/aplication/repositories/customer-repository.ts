import { Customer } from '../../domain/entities/Customer'

export interface CustomerRepository {
  register(customer: Customer): Promise<Customer>
  findByDocument(document: string): Promise<Customer | null>
}
