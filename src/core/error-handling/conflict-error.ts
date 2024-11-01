export class ConflictError extends Error {
  constructor(message: string = 'Resource already exists') {
    super(message)
    this.name = 'ConflictError'
  }
}
