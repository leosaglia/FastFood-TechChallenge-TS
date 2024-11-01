import { CustomerRepository } from '@core/aplication/ports/repositories/customer-repository'
import { IdentifyCustomerByDocumentUseCase } from '@core/aplication/useCases/identify-customer-by-document'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestIdentifyCustomerByDocumentUseCase extends IdentifyCustomerByDocumentUseCase {
  constructor(customerRepository: CustomerRepository) {
    super(customerRepository)
  }
}
