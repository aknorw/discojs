import { CURRENCIES } from '../../constants'

export default function getRelease(releaseId, currency) {
  if (typeof releaseId !== 'number') {
    return Promise.reject(new TypeError(`[getReleaseMethod] releaseId must be a number (${releaseId})`))
  }
  const query = {}
  if (currency && CURRENCIES.includes(currency)) {
    query.curr_abbr = currency
  }
  return this._fetch({
    uri: `/releases/${releaseId}`,
    query,
  })
}
