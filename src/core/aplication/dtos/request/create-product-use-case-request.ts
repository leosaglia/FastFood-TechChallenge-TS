import { Decimal } from 'decimal.js'

export interface CreateProductUseCaseRequest {
  name: string
  price: Decimal
  description: string
  category: string
}
