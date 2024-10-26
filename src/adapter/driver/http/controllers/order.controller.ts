/* eslint-disable prettier/prettier */
import { z } from 'zod'
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'
import { ErrorResponse } from '../presenters/error-response'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { NestCreateOrderUseCase } from '../nest/use-cases/nest-create-order'
import { NestFindOrdersUseCase } from '../nest/use-cases/nest-find-orders'
import { CreateOrderDto } from '../DTOs/create-order.dto'

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
    }),
  ),
  customerId: z.string().optional(),
})

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: NestCreateOrderUseCase,
    private readonly listOrderUseCase: NestFindOrdersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  @ApiResponse({ status: 201, description: 'Order created', type: OrderPresenter })
  @ApiResponse({ status: 400, description: 'Invalid data', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'Product or Customer not found', type: ErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponse })
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
  @ApiOperation({ summary: 'List all orders' })
  @ApiResponse({ status: 200, type: OrderPresenter, isArray: true })
  @ApiResponse({ status: 404, description: 'Product not found', type: ErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponse })
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
