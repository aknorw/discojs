export default function editFolderForUser(username, folderId, name) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[editFolderForUserMethod] username must be a string (${username})`))
  }
  if (typeof folderId !== 'number') {
    return Promise.reject(new TypeError(`[editFolderForUserMethod] folderId must be a number (${folderId})`))
  }
  if (typeof name !== 'string') {
    return Promise.reject(new TypeError(`[editFolderForUserMethod] name must be a string (${name})`))
  }
  return this._fetch({
    uri: `/users/${username}/collection/folders/${folderId}`,
    options: {
      method: 'POST',
      data: { name },
    },
  })
}
