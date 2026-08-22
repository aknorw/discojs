export class DiscogsError extends Error {
  public readonly name: string
  public readonly statusCode: number

  /**
   * Seconds to wait before retrying, from the response's `Retry-After`. Present
   * only when the server sent one -- generally on a 429.
   */
  public readonly retryAfter?: number

  constructor(
    public message: string,
    code: number,
    retryAfter?: number,
  ) {
    super(message)
    this.name = 'DiscogsError'
    this.statusCode = code
    this.retryAfter = retryAfter

    Object.setPrototypeOf(this, DiscogsError.prototype)
  }
}
