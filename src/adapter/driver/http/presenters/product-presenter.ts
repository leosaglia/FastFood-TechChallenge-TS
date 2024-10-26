import { Product } from '@core/domain/entities/product'
import { ApiProperty } from '@nestjs/swagger'

export class ProductPresenter {
  @ApiProperty({ example: '1a442d43-fad4-47ad-91ce-485346ad5a05' })
  private readonly id: string

  @ApiProperty({ example: 'Burguer Bacon' })
  private readonly name: string

  @ApiProperty({ example: 'Contém 2 hamburgueres com queijo e bacon' })
  private readonly description: string

  @ApiProperty({
    example: 'Lanche',
    enum: ['lanche', 'acompanhamento', 'bebida'],
  })
  private readonly category: string

  @ApiProperty({ example: '10.00' })
  private readonly price: string

  constructor(
    id: string,
    name: string,
    description: string,
    category: string,
    price: string,
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.category = category
    this.price = price
  }

  static present(product: Product): ProductPresenter {
    return new ProductPresenter(
      product.getId(),
      product.getName(),
      product.getDescription(),
      product.getCategory(),
      product.getPrice().toFixed(2),
    )
  }
}
