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
} from '@nestjs/common'
import { z } from 'zod'
import { CustomerPresenter } from '../presenters/customer-presenter'
import { NestCreateCustomerUseCase } from '../nest/use-cases/nest-create-customer'
import { NestIdentifyCustomerByDocumentUseCase } from '../nest/use-cases/nest-identify-customer-by-document'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { ResourceAlreadyExistsError } from '@core/error-handling/resource-already-exists-error'

const createCustomertSchema = z.object({
  name: z.string(),
  document: z.string(),
  email: z.string(),
})
type CreateCustomertDto = z.infer<typeof createCustomertSchema>

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly registerCustomerUseCase: NestCreateCustomerUseCase,
    private readonly identifyCustomerByDocumentUseCase: NestIdentifyCustomerByDocumentUseCase,
  ) {}

  @Get(':document')
  async identifyCustomerByDocument(@Param('document') document: string) {
    const result =
      await this.identifyCustomerByDocumentUseCase.execute(document)

    if (result.isFailure()) {
      handleResultError(result.value)
    }

    return CustomerPresenter.present(result.value.customer)
  }

  @Post()
  async registerCustomer(@Body() body: CreateCustomertDto) {
    const { name, document, email } = body
    const result = await this.registerCustomerUseCase.execute({
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
