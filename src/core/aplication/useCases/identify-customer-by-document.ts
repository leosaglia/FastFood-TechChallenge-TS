import { Customer } from '@core/domain/entities/Customer'
import { Document } from '@core/domain/valueObjects/Document'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { NoMappedError } from '@core/error-handling/no-mapped-error'
import { Either, failure, success } from '@core/error-handling/Either'

type IdentifyCustomerByDocumentUseCaseResponse = Either<
  NoMappedError | BadRequestError | ResourceNotFoundError,
  {
    customer: Customer
  }
>
export class IdentifyCustomerByDocumentUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    document: string,
  ): Promise<IdentifyCustomerByDocumentUseCaseResponse> {
    try {
      const documentValue = new Document(document).getValue()

      const customer =
        await this.customerRepository.findByDocument(documentValue)

      if (!customer) {
        return failure(new ResourceNotFoundError('Customer not registered'))
      }

      return success({ customer })
    } catch (error) {
      if (error instanceof BadRequestError)
        return failure(new BadRequestError(error.message))

      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
