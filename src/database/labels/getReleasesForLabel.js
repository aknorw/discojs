import paginate from '../../utils/paginate'

export default function getReleasesForLabel(labelId, pagination) {
  if (typeof labelId !== 'number') {
    return Promise.reject(new TypeError(`[getReleasesForLabelMethod] labelId must be a number (${labelId})`))
  }
  return this._fetch({
    uri: `/labels/${labelId}/releases`,
    query: paginate(pagination),
  })
}
