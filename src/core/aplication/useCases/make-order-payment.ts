import { OrderRepository } from '../repositories/order-repository'
import { NoMappedError } from '@core/error-handling/no-mapped-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { Either, failure, success } from '@core/error-handling/either'
import { OrderStatus } from '@core/domain/enums/order-status'
import { PaymentPort } from '../ports/payment-port'
import { PaymentProcessingError } from '@core/error-handling/payment-processing-error'
import { ConflictError } from '@core/error-handling/conflict-error'

type FindOrdersUseCaseResponse = Either<
  | NoMappedError
  | ResourceNotFoundError
  | PaymentProcessingError
  | ConflictError,
  null
>

export class MakeOrderPaymentUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private payment: PaymentPort,
  ) {}

  async execute(orderId: string): Promise<FindOrdersUseCaseResponse> {
    try {
      const order = await this.orderRepository.findById(orderId)

      if (!order) {
        return failure(new ResourceNotFoundError('Order not found'))
      }

      if (order.getStatus() !== OrderStatus.CREATED) {
        return failure(
          new ConflictError(
            'Payment not allowed for this order. Current status: ' +
              order.getStatus(),
          ),
        )
      }

      const paymentResult = this.payment.processPayment(order.getTotal())

      if (!paymentResult) {
        return failure(new PaymentProcessingError('Payment failed'))
      }

      await this.orderRepository.updateStatus(order.getId(), OrderStatus.PAID)

      return success(null)
    } catch (error) {
      return failure(new NoMappedError('An unexpected error occurred'))
    }
  }
}
