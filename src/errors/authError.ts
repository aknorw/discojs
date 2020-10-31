export class AuthError extends Error {
  public readonly name: string
  public readonly message: string
  public readonly statusCode: number

  constructor() {
    super()
    this.name = 'AuthError'
    this.message = 'Unauthorized'
    this.statusCode = 401

    Object.setPrototypeOf(this, AuthError.prototype)
  }
}
