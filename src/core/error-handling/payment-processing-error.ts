export class PaymentProcessingError extends Error {
  constructor(message: string = 'Payment failed') {
    super(message)
    this.name = 'PaymentProcessingError'
  }
}
