import paginate from '../../utils/paginate'

export default function getSubmissionsForUser(username, pagination) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[getSubmissionsForUserMethod] username must be a string (${username})`))
  }
  return this._fetch({
    uri: `/users/${username}/submissions`,
    query: paginate(pagination),
  })
}
