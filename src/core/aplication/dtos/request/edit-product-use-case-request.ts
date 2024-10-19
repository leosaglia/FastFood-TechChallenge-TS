import { Decimal } from 'decimal.js'

export interface EditProductUseCaseRequest {
  id: string
  name: string
  price: Decimal
  description: string
  category: string
}
