import { ApiProperty } from '@nestjs/swagger'

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Burguer Bacon' })
  name!: string

  @ApiProperty({
    description: 'Description of the product',
    example: 'Contém 2 hamburgueres com queijo e bacon',
  })
  description!: string

  @ApiProperty({
    description: 'Category of the product',
    example: 'Lanche',
    enum: ['lanche', 'bebida', 'acompanhamento'],
  })
  category!: string

  @ApiProperty({ description: 'Price of the product', example: 24.5 })
  price!: number
}
