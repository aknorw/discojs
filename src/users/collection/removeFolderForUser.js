export default function removeFolderForUser(username, folderId) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[removeFolderForUserMethod] username must be a string (${username})`))
  }
  if (typeof folderId !== 'number') {
    return Promise.reject(new TypeError(`[removeFolderForUserMethod] folderId must be a number (${folderId})`))
  }
  return this._fetch({
    uri: `/users/${username}/collection/folders/${folderId}`,
    options: {
      method: 'DELETE',
    },
  })
}
