import { Customer } from '@core/domain/entities/customer'

export class CustomerPresenter {
  static present(customer: Customer) {
    return {
      id: customer.getId(),
      name: customer.getName(),
      document: customer.getDocument(),
      email: customer.getEmail(),
    }
  }
}
