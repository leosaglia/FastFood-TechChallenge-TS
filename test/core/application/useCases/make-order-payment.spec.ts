import { Decimal } from 'decimal.js'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { InMemoryOrderRepository } from '@adapter/driven/repositories/in-memory/in-memory-order-repository'
import { MakeOrderPaymentUseCase } from '@core/aplication/useCases/make-order-payment'
import { PaymentPort } from '@core/aplication/ports/payment-port'

import { OrderRepository } from '@core/aplication/repositories/order-repository'
import { Order } from '@core/domain/entities/order'
import { OrderStatus } from '@core/domain/enums/order-status'
import { ConflictError } from '@core/error-handling/conflict-error'
import { PaymentProcessingError } from '@core/error-handling/payment-processing-error'

describe('MakeOrderPaymentUseCase', () => {
  let orderRepository: OrderRepository
  let paymentPort: PaymentPort
  let makeOrderPaymentUseCase: MakeOrderPaymentUseCase
  let order: Order

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()

    paymentPort = {
      processPayment: vi.fn(),
    }

    makeOrderPaymentUseCase = new MakeOrderPaymentUseCase(
      orderRepository,
      paymentPort,
    )

    order = new Order()
    order.getTotal = vi.fn().mockReturnValue(new Decimal(100))
    orderRepository.create(order)
  })

  it('should return ResourceNotFoundError if order is not found', async () => {
    const result = await makeOrderPaymentUseCase.execute(
      'non-existent-order-id',
    )

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return ConflictError if order status is not CREATED', async () => {
    await orderRepository.updateStatus(order.getId(), OrderStatus.PAID)

    const result = await makeOrderPaymentUseCase.execute(order.getId())

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictError)
    const error = result.value as ConflictError
    expect(error.message).toBe(
      'Payment not allowed for this order. Current status: Pago',
    )
  })

  it('should return PaymentProcessingError if payment processing fails', async () => {
    paymentPort.processPayment = vi.fn().mockImplementation(() => false)

    makeOrderPaymentUseCase = new MakeOrderPaymentUseCase(
      orderRepository,
      paymentPort,
    )

    const result = await makeOrderPaymentUseCase.execute(order.getId())

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(PaymentProcessingError)
  })

  it('should process payment successfully', async () => {
    paymentPort.processPayment = vi.fn().mockImplementation(() => true)

    makeOrderPaymentUseCase = new MakeOrderPaymentUseCase(
      orderRepository,
      paymentPort,
    )

    const result = await makeOrderPaymentUseCase.execute(order.getId())

    expect(result.isSuccess()).toBe(true)
    expect(paymentPort.processPayment).toHaveBeenCalledWith(new Decimal(100))
    const updatedOrder = await orderRepository.findById(order.getId())
    expect(updatedOrder?.getStatus()).toBe(OrderStatus.PAID)
  })
})
