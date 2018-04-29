import { CURRENCIES } from '../../constants'

export default function getListing(listingId, currency) {
  if (typeof listingId !== 'number') {
    return Promise.reject(new TypeError(`[getListingMethod] listingId must be a number (${listingId})`))
  }
  const query = {}
  if (currency && CURRENCIES.includes(currency)) {
    query.curr_abbr = currency
  }
  return this._fetch({
    uri: `/marketplace/listings/${listingId}`,
    query,
  })
}
