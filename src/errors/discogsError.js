export default class DiscogsError extends Error {
  constructor(args) {
    super()
    this.name = 'DiscogsError'
    this.message = args.message
    this.statusCode = args.statusCode
  }
}
