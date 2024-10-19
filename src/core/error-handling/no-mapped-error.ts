export class NoMappedError extends Error {
  constructor(message: string = 'Internal server error') {
    super(message)
    this.name = 'NoMappedError'
  }
}
