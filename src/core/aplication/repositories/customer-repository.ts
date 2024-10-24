import { Customer } from '@core/domain/entities/Customer'

export abstract class CustomerRepository {
  abstract register(customer: Customer): Promise<void>
  abstract findByDocument(document: string): Promise<Customer | null>
  abstract findById(customerId: string): Promise<Customer | null>
}
