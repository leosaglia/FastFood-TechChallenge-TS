import Decimal from 'decimal.js'

export abstract class PaymentPort {
  abstract processPayment(amount: Decimal): boolean
}
