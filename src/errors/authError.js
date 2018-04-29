export default class AuthError extends Error {
  constructor() {
    super()
    this.name = 'AuthError'
    this.message = 'Unauthorized'
    this.statusCode = 401
  }
}
