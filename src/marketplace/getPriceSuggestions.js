export default function getPriceSuggestions(releaseId) {
  if (typeof releaseId !== 'number') {
    return Promise.reject(new TypeError(`[getPriceSuggestionsMethod] releaseId must be a number (${releaseId})`))
  }
  return this._fetch({ uri: `/marketplace/price_suggestions/${releaseId}` })
}
