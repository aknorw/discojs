import paginate from '../../utils/paginate'
import sortBy from '../../utils/sort'

export const sortFields = ['label', 'artist', 'title', 'catno', 'format', 'rating', 'year', 'added']

export default function getItemsInFolderForUser(username, folderId, pagination, sort) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[getItemsInFolderForUserMethod] username must be a string (${username})`))
  }
  if (typeof folderId !== 'number') {
    return Promise.reject(new TypeError(`[getItemsInFolderForUserMethod] folderId must be a number (${folderId})`))
  }
  return this._fetch({
    uri: `/users/${username}/collection/folders/${folderId}/releases`,
    query: {
      ...sortBy(sort, sortFields),
      ...paginate(pagination),
    },
  })
}
