import { RegisterCustomer } from '@core/aplication/useCases/register-customer'
import { Document } from '@core/domain/valueObjects/Document'
import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { MockCustomerRepository } from '../repositories/in-memory-customer-repository'
import { describe, beforeEach, it, expect } from 'vitest'

describe('RegisterCustomer', () => {
  let sut: RegisterCustomer
  let customerRepository: CustomerRepository

  beforeEach(() => {
    customerRepository = new MockCustomerRepository()
    sut = new RegisterCustomer(customerRepository)
  })

  it('should register a new customer', async () => {
    const customer = {
      name: 'John Doe',
      document: '111.444.777-35',
      email: 'john.doe@example.com',
    }

    const registeredCustomer = await sut.execute(customer)

    expect(registeredCustomer?.document).toEqual(
      new Document(customer.document),
    )
    expect(registeredCustomer?.email).toEqual(customer.email)
    expect(registeredCustomer?.name).toEqual(customer.name)
    expect(registeredCustomer?.id).toBeDefined()
  })

  it('should throw an error if customer already exists', async () => {
    const customer = {
      name: 'John Doe',
      document: '111.444.777-35',
      email: 'john.doe@example.com',
    }

    await sut.execute(customer)

    await expect(sut.execute(customer)).rejects.toThrow(
      'Customer already exists.',
    )
  })

  const customerWithInvalidDocument = {
    name: 'John Doe',
    document: 'invalid_document',
    email: 'john.doe@example.com',
  }

  const customerWithInvalidEmail = {
    name: 'John Doe',
    document: '111.444.777-35',
    email: 'invalid_email',
  }

  const CustomerWithEmptyName = {
    name: '',
    document: '111.444.777-35',
    email: 'john.doe@example.com',
  }

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
