export default function getMaster(masterId) {
  if (typeof masterId !== 'number') {
    return Promise.reject(new TypeError(`[getMasterMethod] masterId must be a number (${masterId})`))
  }
  return this._fetch({ uri: `/masters/${masterId}` })
}
