import { Customer } from '@core/domain/entities/Customer'
import { Document } from '@core/domain/valueObjects/Document'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { RegisterCustomerDto } from '@core/aplication/dtos/register-customer-dto'

export class RegisterCustomerUseCase {
  private customerRepository: CustomerRepository

  constructor(customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository
  }

  async execute(dto: RegisterCustomerDto): Promise<Customer> {
    const document = new Document(dto.document)
    const customer = new Customer(dto.name, document, dto.email)

    const customerFound = await this.customerRepository.findByDocument(
      customer.document.getValue(),
    )

    if (customerFound) {
      throw new Error('Customer already exists.')
    }

    return this.customerRepository.register(customer)
  }
}
