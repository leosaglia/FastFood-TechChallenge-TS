export class BadRequestError extends Error {
  constructor(message: string = 'Invalid data') {
    super(message)
    this.name = 'BadRequestError'
  }
}
