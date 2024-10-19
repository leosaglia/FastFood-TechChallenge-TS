import { Customer } from '@core/domain/entities/Customer'
import { Document } from '@core/domain/valueObjects/Document'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { RegisterCustomerUseCaseRequest } from '@core/aplication/dtos/request/register-customer-use-case-request'

export interface RegisterCustomerUseCaseResponse {
  customer: Customer
}

export class RegisterCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    document,
    name,
    email,
  }: RegisterCustomerUseCaseRequest): Promise<RegisterCustomerUseCaseResponse> {
    const customer = new Customer(name, new Document(document), email)

    const customerFound = await this.customerRepository.findByDocument(
      customer.getDocument(),
    )

    if (customerFound) {
      throw new Error('Customer already exists.')
    }

    this.customerRepository.register(customer)

    return { customer }
  }
}
