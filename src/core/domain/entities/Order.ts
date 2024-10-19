import Decimal from 'decimal.js'

import { OrderItem } from './OrderItem'
import { UniqueEntityId } from '../valueObjects/unique-entity-id'

export class Order {
  private id: UniqueEntityId
  private items: OrderItem[] = []

  constructor(id?: string) {
    this.id = new UniqueEntityId(id)
  }

  addItem(item: OrderItem): void {
    const existingItem = this.items.find((i) => i.equals(item))

    if (existingItem) {
      this.updateItem(item)
    } else {
      this.items.push(item)
    }
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
}
