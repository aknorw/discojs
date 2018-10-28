export default function searchRelease(query, options = {}, pagination) {
  if (typeof query !== 'string') {
    return Promise.reject(new TypeError(`[searchReleaseMethod] query must be a string (${query})`))
  }
  return this.searchDatabase(
    {
      ...options,
      query,
      type: 'release',
    },
    pagination,
  )
}
