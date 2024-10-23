import { z } from 'zod'
import Decimal from 'decimal.js'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  Delete,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ProductPresenter } from '../presenters/product-presenter'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { NestEditProductUseCase } from '../nest/use-cases/nest-edit-product'
import { NestFindProductsUseCase } from '../nest/use-cases/nest-find-products'
import { NestDeleteProductUseCase } from '../nest/use-cases/nest-delete-product'
import { NestRegisterProductUseCase } from '../nest/use-cases/nest-register-product'

const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
})

const updateProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
})

const querySchema = z.object({
  category: z.string().optional(),
})

type CreateProductDto = z.infer<typeof createProductSchema>
type UpdateProductDto = z.infer<typeof updateProductSchema>

@Controller('products')
export class ProductController {
  constructor(
    private readonly registerProductUseCase: NestRegisterProductUseCase,
    private readonly editProductUseCase: NestEditProductUseCase,
    private readonly findProductsUseCase: NestFindProductsUseCase,
    private readonly deleteProductUseCase: NestDeleteProductUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async createProduct(@Body() body: CreateProductDto) {
    const { name, description, category, price } = body

    const result = await this.registerProductUseCase.execute({
      name,
      price: new Decimal(price),
      description,
      category,
    })

    if (result.isFailure()) {
      handleResultError(result.value)
    }

    return ProductPresenter.present(result.value.product)
  }

  @Put(':id')
  @UsePipes()
  async updateProduct(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) body: UpdateProductDto,
  ) {
    const { name, description, category, price } = body

    const result = await this.editProductUseCase.execute({
      id,
      name,
      description,
      price: new Decimal(price),
      category,
    })

    if (result.isFailure()) {
      handleResultError(result.value)
    }

    return ProductPresenter.present(result.value.product)
  }

  @Get()
  @UsePipes(new ZodValidationPipe(querySchema))
  async getProducts(@Query() query: { category?: string }) {
    const result = await this.findProductsUseCase.execute(query)

    if (result.isFailure()) {
      handleResultError(result.value)
    }

    const products = result.value.products.map(ProductPresenter.present)

    return { products }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id') id: string) {
    const result = await this.deleteProductUseCase.execute(id)

    if (result.isFailure()) {
      handleResultError(result.value)
    }
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
