import { Document } from '@core/domain/valueObjects/Document'
import { RegisterCustomerUseCase } from '@core/aplication/useCases/register-customer'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { InMemoryCustomerRepository } from '@adapter/driven/repositories/in-memory/in-memory-customer-repository'
import { makeRegisterCustomerRequest } from '@test/factories/customer-factory'
import { Customer } from '@core/domain/entities/Customer'
import { ResourceAlreadyExistsError } from '@core/error-handling/resource-already-exists-error'
import { BadRequestError } from '@core/error-handling/bad-request-error'

describe('RegisterCustomer', () => {
  let sut: RegisterCustomerUseCase
  let customerRepository: CustomerRepository

  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository()
    sut = new RegisterCustomerUseCase(customerRepository)
  })

  it('should register a new customer', async () => {
    const customer = makeRegisterCustomerRequest()

    const result = await sut.execute(customer)
    const { customer: registeredCustomer } = result.value as {
      customer: Customer
    }

    expect(result.isSuccess()).toBe(true)

    expect(registeredCustomer?.getDocument()).toEqual(
      new Document(customer.document).getValue(),
    )
    expect(registeredCustomer?.getEmail()).toEqual(customer.email)
    expect(registeredCustomer?.getName()).toEqual(customer.name)
    expect(registeredCustomer?.id).toBeDefined()
  })

  it('should throw an error if customer already exists', async () => {
    const customer = makeRegisterCustomerRequest()

    await sut.execute(customer)

    const result = await sut.execute(customer)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
    const error = result.value as ResourceAlreadyExistsError
    expect(error.message).toBe('Customer already exists.')
  })

  const customerWithInvalidDocument = makeRegisterCustomerRequest({
    document: 'invalid_document',
  })

  const customerWithInvalidEmail = makeRegisterCustomerRequest({
    email: 'invalid_email',
  })

  const CustomerWithEmptyName = makeRegisterCustomerRequest({
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
