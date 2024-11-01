import { Injectable } from '@nestjs/common'
import { PaymentPort } from '@core/aplication/ports/payment-port'
import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { MakeOrderPaymentUseCase } from '@core/aplication/useCases/make-order-payment'

@Injectable()
export class NestMakeOrderPaymentUseCase extends MakeOrderPaymentUseCase {
  constructor(orderRepository: OrderRepository, paymentPort: PaymentPort) {
    super(orderRepository, paymentPort)
  }
}
