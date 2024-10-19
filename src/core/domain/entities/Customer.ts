import { Document } from '@core/domain/valueObjects/Document'
import { UniqueEntityId } from '../valueObjects/unique-entity-id'

export class Customer {
  id: UniqueEntityId

  constructor(
    private name: string,
    private document: Document,
    private email: string,
    id?: string,
  ) {
    this.validateName(name)
    this.validateEmail(email)
    this.id = new UniqueEntityId(id)
  }

  public getName(): string {
    return this.name
  }

  public getDocument(): string {
    return this.document.getValue()
  }

  public getEmail(): string {
    return this.email
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Invalid name.')
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email.')
    }
  }
}
