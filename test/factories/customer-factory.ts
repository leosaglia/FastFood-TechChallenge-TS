import { CreateCustomerUseCaseRequest } from '@core/aplication/dtos/request/create-customer-use-case-request'
import { Customer } from '@core/domain/entities/customer'
import { Document } from '@core/domain/valueObjects/document'

interface CustomerProps {
  id: string
  name: string
  document: Document
  email: string
}

export function makeRegisterCustomerRequest(
  override: Partial<CreateCustomerUseCaseRequest> = {},
): CreateCustomerUseCaseRequest {
  return {
    name: 'John Doe',
    document: '111.444.777-35',
    email: 'john.doe@example.com',
    ...override,
  }
}

export function makeCustomer({
  id = '1',
  name = 'John Doe',
  document = new Document('111.444.777-35'),
  email = 'john.doe@example.com',
}: Partial<CustomerProps> = {}): Customer {
  return new Customer(name, document, email, id)
}
