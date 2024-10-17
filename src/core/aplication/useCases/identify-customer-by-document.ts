import { Customer } from '@core/domain/entities/Customer'
import { Document } from '@core/domain/valueObjects/Document'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'

export class IdentifyCustomerByDocumentUseCase {
  private customerRepository: CustomerRepository

  constructor(customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository
  }

  async execute(document: string): Promise<Customer> {
    const documentValue = new Document(document).getValue()

    const customer = await this.customerRepository.findByDocument(documentValue)

    if (!customer) {
      throw new Error('Customer not registered')
    }

    return customer
  }
}
