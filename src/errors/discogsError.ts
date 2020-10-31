export class DiscogsError extends Error {
  public readonly name: string
  public readonly statusCode: number

  constructor(public message: string, code: number) {
    super(message)
    this.name = 'DiscogsError'
    this.statusCode = code

    Object.setPrototypeOf(this, DiscogsError.prototype)
  }
}
