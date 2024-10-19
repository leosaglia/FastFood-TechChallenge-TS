import { IdentifyCustomerByDocumentUseCase } from '@core/aplication/useCases/identify-customer-by-document'
import { Customer } from '@core/domain/entities/Customer'
import { Document } from '@core/domain/valueObjects/Document'
import { InMemoryCustomerRepository } from '../repositories/in-memory-customer-repository'

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

    const identifiedCustomer = (await sut.execute('111.444.777-35')).customer

    expect(identifiedCustomer).toBe(customer)
  })

  it('should throw an error when the customer was not registered', async () => {
    await expect(sut.execute('111.444.777-35')).rejects.toThrow(
      'Customer not registered',
    )
  })

  it('should throw an error when the document is invalid', async () => {
    await expect(sut.execute('invalid_document')).rejects.toThrow(
      'Invalid document.',
    )
  })
})
