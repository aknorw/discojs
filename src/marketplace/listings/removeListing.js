export default function removeListing(listingId) {
  if (typeof listingId !== 'number') {
    return Promise.reject(new TypeError(`[removeListingMethod] listingId must be a number (${listingId})`))
  }
  return this._fetch({
    uri: `/marketplace/listings/${listingId}`,
    method: 'DELETE',
  })
}
