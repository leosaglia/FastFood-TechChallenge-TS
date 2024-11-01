import { CustomerRepository } from '@core/aplication/ports/repositories/customer-repository'
import { CreateCustomerUseCase } from '@core/aplication/useCases/create-customer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestCreateCustomerUseCase extends CreateCustomerUseCase {
  constructor(customerRepository: CustomerRepository) {
    super(customerRepository)
  }
}
