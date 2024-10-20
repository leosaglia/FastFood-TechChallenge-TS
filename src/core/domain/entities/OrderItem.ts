import Decimal from 'decimal.js'

import { UniqueEntityId } from '../valueObjects/unique-entity-id'

export class OrderItem {
  private productId: UniqueEntityId
  private orderId: UniqueEntityId
  private quantity: number
  private productPrice: Decimal

  constructor(
    productId: string,
    orderId: string,
    productPrice: Decimal,
    quantity: number,
  ) {
    this.productId = new UniqueEntityId(productId)
    this.orderId = new UniqueEntityId(orderId)
    this.productPrice = productPrice // manter histórico de preço, caso o produto venha a ser atualizado
    this.quantity = quantity
  }

  getTotal(): Decimal {
    return this.productPrice.mul(this.quantity)
  }

  getProductId(): UniqueEntityId {
    return this.productId
  }

  getOrderId(): UniqueEntityId {
    return this.orderId
  }

  getProductPrice(): Decimal {
    return this.productPrice
  }

  getQuantity(): number {
    return this.quantity
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity
  }

  equals(other: OrderItem): boolean {
    return (
      this.getProductId().getValue() === other.getProductId().getValue() &&
      this.getOrderId().getValue() === other.getOrderId().getValue()
    )
  }
}
