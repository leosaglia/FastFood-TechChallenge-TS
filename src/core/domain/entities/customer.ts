import { Document } from '@core/domain/valueObjects/document'
import { UniqueEntityId } from '../valueObjects/unique-entity-id'
import { BadRequestError } from '@core/error-handling/bad-request-error'

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

  public getId(): string {
    return this.id.getValue()
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
      throw new BadRequestError('Invalid name.')
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new BadRequestError('Invalid email.')
    }
  }
}
