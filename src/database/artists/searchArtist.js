export default function searchArtist(query, options = {}, pagination) {
  if (typeof query !== 'string') {
    return Promise.reject(new TypeError(`[searchArtistMethod] query must be a string (${query})`))
  }
  return this.searchDatabase({
    ...options,
    query,
    type: 'artist',
  }, pagination)
}
