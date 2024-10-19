import Decimal from 'decimal.js'

import { Product } from './Product'
import { UniqueEntityId } from '../valueObjects/unique-entity-id'

export class OrderItem {
  private id: UniqueEntityId
  private product: Product
  private quantity: number

  constructor(product: Product, quantity: number, id?: string) {
    this.product = product
    this.quantity = quantity
    this.id = new UniqueEntityId(id)
  }

  getTotal(): Decimal {
    return this.product.getPrice().mul(this.quantity)
  }

  getProduct(): Product {
    return this.product
  }

  getQuantity(): number {
    return this.quantity
  }

  equals(other: OrderItem): boolean {
    return this.product.getId() === other.product.getId()
  }
}
