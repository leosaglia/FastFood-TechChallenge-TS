import { Customer } from '@core/domain/entities/customer'
import { ApiProperty } from '@nestjs/swagger'

export class CustomerPresenter {
  @ApiProperty({ example: '1a442d43-fad4-47ad-91ce-485346ad5a05' })
  private readonly id: string

  @ApiProperty({ example: 'John Doe' })
  private readonly name: string

  @ApiProperty({ example: '12345678900' })
  private readonly document: string

  @ApiProperty({ example: 'john.doe@example.com' })
  private readonly email: string

  constructor(id: string, name: string, document: string, email: string) {
    this.id = id
    this.name = name
    this.document = document
    this.email = email
  }

  static present(customer: Customer): CustomerPresenter {
    return new CustomerPresenter(
      customer.getId(),
      customer.getName(),
      customer.getDocument(),
      customer.getEmail(),
    )
  }
}
