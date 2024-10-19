import { BadRequestError } from '@core/error-handling/bad-request-error'

export class Category {
  private readonly validCategories = ['Lanche', 'Bebida', 'Acompanhamento']

  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new BadRequestError('Invalid category.')
    }
    this.value = value
  }

  private isValid(value: string): boolean {
    return this.validCategories.includes(value)
  }

  getValue(): string {
    return this.value
  }
}
