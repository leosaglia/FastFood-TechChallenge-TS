import { Document } from '@core/domain/valueObjects/Document'
import { RegisterCustomerUseCase } from '@core/aplication/useCases/register-customer'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { InMemoryCustomerRepository } from '../repositories/in-memory-customer-repository'
import { makeRegisterCustomerRequest } from '@test/factories/customer-factory'

describe('RegisterCustomer', () => {
  let sut: RegisterCustomerUseCase
  let customerRepository: CustomerRepository

  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository()
    sut = new RegisterCustomerUseCase(customerRepository)
  })

  it('should register a new customer', async () => {
    const customer = makeRegisterCustomerRequest()

    const registeredCustomer = (await sut.execute(customer)).customer

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

    await expect(sut.execute(customer)).rejects.toThrow(
      'Customer already exists.',
    )
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
      await expect(sut.execute(invalidFCustomer)).rejects.toThrow(excMessage)
    },
  )
})
