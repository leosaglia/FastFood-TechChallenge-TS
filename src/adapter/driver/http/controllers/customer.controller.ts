/* eslint-disable prettier/prettier */
import { z } from 'zod'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CustomerPresenter } from '../presenters/customer-presenter'
import { ErrorResponse } from '../presenters/error-response'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { ResourceAlreadyExistsError } from '@core/error-handling/resource-already-exists-error'
import { NestCreateCustomerUseCase } from '../nest/use-cases/nest-create-customer'
import { NestIdentifyCustomerByDocumentUseCase } from '../nest/use-cases/nest-identify-customer-by-document'
import { CreateCustomerDto } from '../DTOs/create-customer.dto'

const createCustomertSchema = z.object({
  name: z.string(),
  document: z.string(),
  email: z.string(),
})

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: NestCreateCustomerUseCase,
    private readonly identifyCustomerByDocumentUseCase: NestIdentifyCustomerByDocumentUseCase,
  ) {}

  @Get(':document')
  @ApiOperation({ summary: 'Identify a customer by document' })
  @ApiParam({ name: 'document', description: 'Customer document', type: 'string' })
  @ApiResponse({ status: 200, description: 'Customer found', type: CustomerPresenter })
  @ApiResponse({ status: 400, description: 'Invalid data', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'Customer not found', type: ErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponse })
  async identifyCustomerByDocument(@Param('document') document: string) {
    const result =
      await this.identifyCustomerByDocumentUseCase.execute(document)

    if (result.isFailure()) {
      handleResultError(result.value)
    }

    return CustomerPresenter.present(result.value.customer)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created', type: CustomerPresenter })
  @ApiResponse({ status: 400, description: 'Invalid data', type: ErrorResponse })
  @ApiResponse({ status: 409, description: 'Customer already exists', type: ErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponse })
  @UsePipes(new ZodValidationPipe(createCustomertSchema))
  async createCustomer(@Body() body: CreateCustomerDto) {
    const { name, document, email } = body
    const result = await this.createCustomerUseCase.execute({
      name,
      document,
      email,
    })

    if (result.isFailure()) {
      handleResultError(result.value)
    }

    return CustomerPresenter.present(result.value.customer)
  }
}

function handleResultError(
  error:
    | BadRequestError
    | ResourceNotFoundError
    | ResourceAlreadyExistsError
    | Error,
): never {
  switch (error.constructor) {
    case BadRequestError:
      throw new BadRequestException(error.message)
    case ResourceNotFoundError:
      throw new NotFoundException(error.message)
    case ResourceAlreadyExistsError:
      throw new ConflictException(error.message)
    default:
      throw new InternalServerErrorException(error.message)
  }
}
