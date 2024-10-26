import { ApiProperty } from '@nestjs/swagger'

class OrderItemDto {
  @ApiProperty({ example: '1a442d43-fad4-47ad-91ce-485346ad5a05' })
  productId!: string

  @ApiProperty({ example: 2 })
  quantity!: number
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Items of the order',
    type: [OrderItemDto],
  })
  items!: OrderItemDto[]

  @ApiProperty({
    description: 'ID of the customer',
    example: '1a442d43-fad4-47ad-91ce-485346ad5a05',
  })
  customerId?: string
}
