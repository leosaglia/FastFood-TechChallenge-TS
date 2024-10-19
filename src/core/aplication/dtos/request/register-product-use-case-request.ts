import { Decimal } from 'decimal.js'

export interface RegisterProductUseCaseRequest {
  name: string
  price: Decimal
  description: string
  category: string
}
