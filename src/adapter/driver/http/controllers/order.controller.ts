import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'
import { NestCreateOrderUseCase } from '../nest/use-cases/nest-create-order'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { NestFindOrdersUseCase } from '../nest/use-cases/nest-find-orders'

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
    }),
  ),
  customerId: z.string().optional(),
})

type CreateOrderDto = z.infer<typeof createOrderSchema>

@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: NestCreateOrderUseCase,
    private readonly listOrderUseCase: NestFindOrdersUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  async createOrder(@Body() body: CreateOrderDto) {
    const { items, customerId } = body

    const result = await this.createOrderUseCase.execute({
      items,
      customerId,
    })

    if (result.isFailure()) {
      handleResultError(result.value)
    }

    return OrderPresenter.present(result.value.order, result.value.products)
  }

  @Get()
  async listOrders() {
    const result = await this.listOrderUseCase.execute()

    if (result.isFailure()) {
      handleResultError(result.value)
    }

    return result.value.orders.map(({ order, products }) =>
      OrderPresenter.present(order, products),
    )
  }
}

function handleResultError(
  error: BadRequestError | ResourceNotFoundError | Error,
): never {
  switch (error.constructor) {
    case BadRequestError:
      throw new BadRequestException(error.message)
    case ResourceNotFoundError:
      throw new NotFoundException(error.message)
    default:
      throw new InternalServerErrorException(error.message)
  }
}
