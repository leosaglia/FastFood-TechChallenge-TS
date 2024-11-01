import { ApiProperty } from '@nestjs/swagger'

export class CreateCustomerDto {
  @ApiProperty({ description: 'Name of the customer', example: 'John Doe' })
  name!: string

  @ApiProperty({
    description: 'Document of the customer',
    example: '03150794013',
  })
  document!: string

  @ApiProperty({
    description: 'Email of the customer',
    example: 'john.doe@example.com',
  })
  email!: string
}
