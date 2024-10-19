import { Customer } from '@core/domain/entities/Customer'
import { Document } from '@core/domain/valueObjects/Document'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'

interface IdentifyCustomerByDocumentUseCaseResponse {
  customer: Customer
}

export class IdentifyCustomerByDocumentUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    document: string,
  ): Promise<IdentifyCustomerByDocumentUseCaseResponse> {
    const documentValue = new Document(document).getValue()

    const customer = await this.customerRepository.findByDocument(documentValue)

    if (!customer) {
      throw new Error('Customer not registered')
    }

    return { customer }
  }
}
