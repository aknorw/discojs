import paginate from '../../utils/paginate'

export default function getListsForUser(username, pagination) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[getListsForUserMethod] username must be a string (${username})`))
  }
  return this._fetch({
    uri: `/users/${username}/lists`,
    query: paginate(pagination),
  })
}
