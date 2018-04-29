import paginate from '../../utils/paginate'

export default function getWantlist(username, pagination) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[getWantlistMethod] username must be a string (${username})`))
  }
  return this._fetch({
    uri: `/users/${username}/wants`,
    query: paginate(pagination),
  })
}
