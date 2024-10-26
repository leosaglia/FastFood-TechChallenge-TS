import { Document } from '@core/domain/valueObjects/document'
import { CreateCustomerUseCase } from '@core/aplication/useCases/create-customer'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { InMemoryCustomerRepository } from '@adapter/driven/repositories/in-memory/in-memory-customer-repository'
import { makeCreateCustomerRequest } from '@test/factories/customer-factory'
import { Customer } from '@core/domain/entities/customer'
import { ResourceAlreadyExistsError } from '@core/error-handling/resource-already-exists-error'
import { BadRequestError } from '@core/error-handling/bad-request-error'

describe('CreateCustomer', () => {
  let sut: CreateCustomerUseCase
  let customerRepository: CustomerRepository

  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository()
    sut = new CreateCustomerUseCase(customerRepository)
  })

  it('should create a new customer', async () => {
    const customer = makeCreateCustomerRequest()

    const result = await sut.execute(customer)
    const { customer: createdCustomer } = result.value as {
      customer: Customer
    }

    expect(result.isSuccess()).toBe(true)

    expect(createdCustomer?.getDocument()).toEqual(
      new Document(customer.document).getValue(),
    )
    expect(createdCustomer?.getEmail()).toEqual(customer.email)
    expect(createdCustomer?.getName()).toEqual(customer.name)
    expect(createdCustomer?.id).toBeDefined()
  })

  it('should throw an error if customer already exists', async () => {
    const customer = makeCreateCustomerRequest()

    await sut.execute(customer)

    const result = await sut.execute(customer)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
    const error = result.value as ResourceAlreadyExistsError
    expect(error.message).toBe('Customer already exists.')
  })

  const customerWithInvalidDocument = makeCreateCustomerRequest({
    document: 'invalid_document',
  })

  const customerWithInvalidEmail = makeCreateCustomerRequest({
    email: 'invalid_email',
  })

  const CustomerWithEmptyName = makeCreateCustomerRequest({
    name: '',
  })

  it.each([
    [customerWithInvalidDocument, 'Invalid document.'],
    [customerWithInvalidEmail, 'Invalid email.'],
    [CustomerWithEmptyName, 'Invalid name.'],
  ])(
    'should throw an error if pass invalid fields',
    async (invalidFCustomer, excMessage) => {
      const result = await sut.execute(invalidFCustomer)

      expect(result.isFailure()).toBe(true)
      expect(result.value).toBeInstanceOf(BadRequestError)
      const error = result.value as BadRequestError
      expect(error.message).toBe(excMessage)
    },
  )
})
