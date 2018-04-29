export default function getLabel(labelId) {
  if (typeof labelId !== 'number') {
    return Promise.reject(new TypeError(`[getLabelMethod] labelId must be a number (${labelId})`))
  }
  return this._fetch({ uri: `/labels/${labelId}` })
}
