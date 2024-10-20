import { Customer } from '@core/domain/entities/Customer'
import { Document } from '@core/domain/valueObjects/Document'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { RegisterCustomerUseCaseRequest } from '@core/aplication/dtos/request/register-customer-use-case-request'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'
import { Either, failure, success } from '@core/error-handling/either'
import { ResourceAlreadyExistsError } from '@core/error-handling/resource-already-exists-error'

type RegisterCustomerUseCaseResponse = Either<
  NoMappedError | BadRequestError | ResourceAlreadyExistsError,
  {
    customer: Customer
  }
>

export class RegisterCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    document,
    name,
    email,
  }: RegisterCustomerUseCaseRequest): Promise<RegisterCustomerUseCaseResponse> {
    try {
      const customer = new Customer(name, new Document(document), email)

      const customerFound = await this.customerRepository.findByDocument(
        customer.getDocument(),
      )

      if (customerFound) {
        return failure(
          new ResourceAlreadyExistsError('Customer already exists.'),
        )
      }

      this.customerRepository.register(customer)

      return success({ customer })
    } catch (error) {
      if (error instanceof BadRequestError)
        return failure(new BadRequestError(error.message))

      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
