import paginate from '../../utils/paginate'

export default function getVersionsForMaster(masterId, pagination) {
  if (typeof masterId !== 'number') {
    return Promise.reject(new TypeError(`[getVersionsForMasterMethod] masterId must be a number (${masterId})`))
  }
  return this._fetch({
    uri: `/masters/${masterId}/versions`,
    query: paginate(pagination),
  })
}
