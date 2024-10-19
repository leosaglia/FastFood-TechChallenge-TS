import { RegisterCustomerUseCaseRequest } from '@core/aplication/dtos/request/register-customer-use-case-request'

export function makeRegisterCustomerRequest(
  override: Partial<RegisterCustomerUseCaseRequest> = {},
): RegisterCustomerUseCaseRequest {
  return {
    name: 'John Doe',
    document: '111.444.777-35',
    email: 'john.doe@example.com',
    ...override,
  }
}
