import { Module } from '@nestjs/common'
import MercadoPago from './external-services/mercado-pago'
import { PaymentPort } from '@core/aplication/ports/payment-port'

@Module({
  providers: [{ provide: PaymentPort, useClass: MercadoPago }],
  exports: [PaymentPort],
})
export class ExternalServiceModule {}
