import { Customer } from '@core/domain/entities/customer'
import { Document } from '@core/domain/valueObjects/document'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { CreateCustomerUseCaseRequest } from '@core/aplication/dtos/request/create-customer-use-case-request'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'
import { Either, failure, success } from '@core/error-handling/either'
import { ResourceAlreadyExistsError } from '@core/error-handling/resource-already-exists-error'

type CreateCustomerUseCaseResponse = Either<
  NoMappedError | BadRequestError | ResourceAlreadyExistsError,
  {
    customer: Customer
  }
>

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({
    document,
    name,
    email,
  }: CreateCustomerUseCaseRequest): Promise<CreateCustomerUseCaseResponse> {
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

      this.customerRepository.create(customer)

      return success({ customer })
    } catch (error) {
      if (error instanceof BadRequestError)
        return failure(new BadRequestError(error.message))

      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}