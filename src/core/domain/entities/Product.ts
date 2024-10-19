import { randomUUID } from 'node:crypto'
import { Decimal } from 'decimal.js'

import { Category } from '@core/domain/valueObjects/Category'

export class Product {
  private id: string

  constructor(
    private name: string,
    private price: Decimal,
    private description: string,
    private category: Category,
    id?: string,
  ) {
    this.validateName(name)
    this.validatePrice(price)
    this.validateDescription(description)
    this.id = id || randomUUID()
  }

  public getId(): string {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getPrice(): Decimal {
    return this.price
  }

  public getDescription(): string {
    return this.description
  }

  public getCategory(): Category {
    return this.category
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Invalid name.')
    }
  }

  private validatePrice(price: Decimal): void {
    if (price.isNaN() || price.isNegative()) {
      throw new Error('Invalid price.')
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length < 10) {
      throw new Error('Invalid description.')
    }
  }
}
