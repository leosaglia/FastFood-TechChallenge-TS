import { ApiProperty } from '@nestjs/swagger'

export class ErrorResponse {
  @ApiProperty({ description: 'Error message' })
  message!: string

  @ApiProperty({ description: 'Error type' })
  error!: string

  @ApiProperty({ description: 'HTTP status code' })
  statusCode!: number
}
