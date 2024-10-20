import Decimal from 'decimal.js'

import { OrderItem } from './OrderItem'
import { OrderStatus } from '../enums/order-status'
import { UniqueEntityId } from '../valueObjects/unique-entity-id'

export class Order {
  private id: UniqueEntityId
  private items: OrderItem[] = []
  private createdAt: Date
  private updatedAt: Date
  private status: OrderStatus = OrderStatus.CREATED

  constructor(id?: string) {
    this.id = new UniqueEntityId(id)
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  addItem(item: OrderItem): void {
    const existingItem = this.items.find((i) => i.equals(item))

    if (existingItem) {
      this.updateDuplicatedItem(item)
    } else {
      this.items.push(item)
    }
  }

  private updateDuplicatedItem(updatedItem: OrderItem): void {
    this.items = this.items.map((item) => {
      if (item.equals(updatedItem)) {
        item.setQuantity(item.getQuantity() + updatedItem.getQuantity())
      }
      return item
    })
  }

  updateItem(updatedItem: OrderItem): void {
    this.items = this.items.map((item) =>
      item.equals(updatedItem) ? updatedItem : item,
    )
  }

  getTotal(): Decimal {
    return this.items.reduce(
      (total, item) => total.add(item.getTotal()),
      new Decimal(0),
    )
  }

  getId(): string {
    return this.id.getValue()
  }

  getItems(): OrderItem[] {
    return this.items
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  getStatus(): OrderStatus {
    return this.status
  }
}
