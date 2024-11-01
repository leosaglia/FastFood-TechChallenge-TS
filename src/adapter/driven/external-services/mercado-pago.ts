import { PaymentPort } from '@core/aplication/ports/payment-port'
import { Injectable } from '@nestjs/common'
import Decimal from 'decimal.js'

@Injectable()
export default class MercadoPago implements PaymentPort {
  processPayment(amount: Decimal): boolean {
    return true
  }
}
