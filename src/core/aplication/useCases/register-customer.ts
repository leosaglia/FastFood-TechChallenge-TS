import { Customer } from '../../domain/entities/Customer'
import { Document } from '../../domain/valueObjects/Document'
import { CustomerRepository } from '../repositories/customer-repository'

interface RegisterCustomerDto {
  document: string
  name: string
  email: string
}

export class RegisterCustomer {
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
