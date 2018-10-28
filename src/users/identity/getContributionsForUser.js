import paginate from '../../utils/paginate'
import sortBy from '../../utils/sort'

export const sortFields = ['label', 'artist', 'title', 'catno', 'format', 'rating', 'year', 'added']

export default function getContributionsForUser(username, pagination, sort) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[getContributionsForUserMethod] username must be a string (${username})`))
  }
  return this._fetch({
    uri: `/users/${username}/contributions`,
    query: {
      ...paginate(pagination),
      ...sortBy(sort, sortFields),
    },
  })
}
