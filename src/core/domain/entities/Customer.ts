import { randomUUID } from 'node:crypto'

import { Document } from '@core/domain/valueObjects/Document'

export class Customer {
  id: string

  constructor(
    private name: string,
    private document: Document,
    private email: string,
    id?: string,
  ) {
    this.validateName(name)
    this.validateEmail(email)
    this.id = id || randomUUID()
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
