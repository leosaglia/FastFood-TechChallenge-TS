/* eslint-disable prettier/prettier */
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
  InternalServerErrorException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ProductPresenter } from '../presenters/product-presenter'
import { ErrorResponse } from '../presenters/error-response'
import { BadRequestError } from '@core/error-handling/bad-request-error'
import { ResourceNotFoundError } from '@core/error-handling/resource-not-found-error'
import { NestEditProductUseCase } from '../nest/use-cases/nest-edit-product'
import { NestFindProductsUseCase } from '../nest/use-cases/nest-find-products'
import { NestDeleteProductUseCase } from '../nest/use-cases/nest-delete-product'
import { NestCreateProductUseCase } from '../nest/use-cases/nest-create-product'
import { CreateProductDto } from '../DTOs/create-product.dto'
import { UpdateProductDto } from '../DTOs/update-product.dto'

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

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly registerProductUseCase: NestCreateProductUseCase,
    private readonly editProductUseCase: NestEditProductUseCase,
    private readonly findProductsUseCase: NestFindProductsUseCase,
    private readonly deleteProductUseCase: NestDeleteProductUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created', type: ProductPresenter })
  @ApiResponse({ status: 400, description: 'Invalid data', type: ErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponse })
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

  @Get()
  @ApiOperation({ summary: 'Get products by category' })
  @ApiQuery({ name: 'category', description: 'Filter products by category', required: false })
  @ApiResponse({ status: 200, description: 'Products found', type: [ProductPresenter] })
  @ApiResponse({ status: 400, description: 'Invalid category', type: ErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponse })
  @UsePipes(new ZodValidationPipe(querySchema))
  async getProducts(@Query() query: { category?: string }) {
    const result = await this.findProductsUseCase.execute(query)

    if (result.isFailure()) {
      handleResultError(result.value)
    }

    const products = result.value.products.map(ProductPresenter.present)

    return { products }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiParam({ name: 'id', description: 'ID of the product to update', type: String })
  @ApiResponse({ status: 200, description: 'Product updated', type: ProductPresenter })
  @ApiResponse({ status: 400, description: 'Invalid data', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'Product not found', type: ErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponse })
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'ID of the product to delete', type: String })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found', type: ErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorResponse })
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
