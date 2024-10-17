import Decimal from 'decimal.js'

export interface RegisterProductDto {
  id?: string
  name: string
  price: Decimal
  description: string
  category: string
}
