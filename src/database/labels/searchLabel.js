export default function searchLabel(query, options = {}, pagination) {
  if (typeof query !== 'string') {
    return Promise.reject(new TypeError(`[searchLabelMethod] query must be a string (${query})`))
  }
  return this.searchDatabase({
    ...options,
    query,
    type: 'label',
  }, pagination)
}
