import { z } from 'zod'
import Decimal from 'decimal.js'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { NestRegisterProductUseCase } from '../nest/use-cases/nest-register-product-use-case'

const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
})

type CreateProductDto = z.infer<typeof createProductSchema>

@Controller('products')
export class ProductController {
  constructor(private readonly registerProduct: NestRegisterProductUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async createProduct(@Body() body: CreateProductDto) {
    const { name, description, category, price } = body

    await this.registerProduct.execute({
      name,
      price: new Decimal(price),
      description,
      category,
    })
  }
}
