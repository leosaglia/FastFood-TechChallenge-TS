import { randomUUID } from 'node:crypto'
import { Document } from '@core/domain/valueObjects/Document'

export class Customer {
  public id: string

  constructor(
    public name: string,
    public document: Document,
    public email: string,
    id?: string,
  ) {
    this.validateName(name)
    this.validateEmail(email)
    this.id = id || randomUUID()
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
