import Decimal from 'decimal.js'

export interface RegisterProductDto {
  name: string
  price: Decimal
  description: string
  category: string
}
