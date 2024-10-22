import { CustomerRepository } from '@core/aplication/repositories/customer-repository'
import { RegisterCustomerUseCase } from '@core/aplication/useCases/register-customer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRegisterCustomerUseCase extends RegisterCustomerUseCase {
  constructor(customerRepository: CustomerRepository) {
    super(customerRepository)
  }
}
