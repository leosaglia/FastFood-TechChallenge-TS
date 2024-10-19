import { IdentifyCustomerByDocumentUseCase } from '@core/aplication/useCases/identify-customer-by-document'
import { Customer } from '@core/domain/entities/Customer'
import { Document } from '@core/domain/valueObjects/Document'
import { InMemoryCustomerRepository } from '../repositories/in-memory-customer-repository'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { BadRequestError } from '@core/error-handling/bad-request-error'

describe('IdentifyCustomerByDocument', () => {
  let sut: IdentifyCustomerByDocumentUseCase
  let mockCustomerRepository: InMemoryCustomerRepository

  beforeEach(() => {
    mockCustomerRepository = new InMemoryCustomerRepository()
    sut = new IdentifyCustomerByDocumentUseCase(mockCustomerRepository)
  })

  it('should identify a customer by document successfully', async () => {
    const customer = new Customer(
      'John Doe',
      new Document('111.444.777-35'),
      'john.doe@example.com',
      '1',
    )
    mockCustomerRepository.register(customer)

    const result = await sut.execute('111.444.777-35')
    const identifiedCustomer = result.value as { customer: Customer }

    expect(result.isSuccess()).toBe(true)
    expect(identifiedCustomer.customer).toBe(customer)
  })

  it('should throw an error when the customer was not registered', async () => {
    const result = await sut.execute('111.444.777-35')

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    const error = result.value as ResourceNotFoundError
    expect(error.message).toBe('Customer not registered')
  })

  it('should throw an error when the document is invalid', async () => {
    const result = await sut.execute('11111')

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(BadRequestError)
    const error = result.value as BadRequestError
    expect(error.message).toBe('Invalid document.')
  })
})
