import { Customer } from '@core/domain/entities/Customer'

export interface CustomerRepository {
  register(customer: Customer): Promise<void>
  findByDocument(document: string): Promise<Customer | null>
}
