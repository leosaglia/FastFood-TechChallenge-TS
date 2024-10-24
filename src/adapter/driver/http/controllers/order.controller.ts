import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { NestCreateOrderUseCase } from '../nest/use-cases/nest-create-order'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'

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
  constructor(private readonly createOrderUseCase: NestCreateOrderUseCase) {}

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

    return result.value.order
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
