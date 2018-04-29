import { CURRENCIES } from '../constants'

export default function getFee(price, currency) {
  if (typeof price !== 'number') {
    return Promise.reject(new TypeError(`[getFeeMethod] price must be a number (${price})`))
  }
  let uri = `/marketplace/fee/${price}`
  if (currency && CURRENCIES.includes(currency)) {
    uri += `/${currency}`
  }
  return this._fetch({ uri })
}
