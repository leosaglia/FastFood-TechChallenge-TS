import { Decimal } from 'decimal.js'

import { Category } from '@core/domain/valueObjects/category'
import { UniqueEntityId } from '../valueObjects/unique-entity-id'
import { BadRequestError } from '@core/error-handling/bad-request-error'

export class Product {
  private id: UniqueEntityId

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
    this.id = new UniqueEntityId(id)
  }

  public getId(): string {
    return this.id.getValue()
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

  public getCategory(): string {
    return this.category.getValue()
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new BadRequestError('Invalid name.')
    }
  }

  private validatePrice(price: Decimal): void {
    if (price.isNaN() || price.isNegative()) {
      throw new BadRequestError('Invalid price.')
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length < 10) {
      throw new BadRequestError('Invalid description.')
    }
  }
}
