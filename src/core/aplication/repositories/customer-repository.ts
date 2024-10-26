import { Customer } from '@core/domain/entities/customer'

export abstract class CustomerRepository {
  abstract create(customer: Customer): Promise<void>
  abstract findByDocument(document: string): Promise<Customer | null>
  abstract findById(customerId: string): Promise<Customer | null>
}
