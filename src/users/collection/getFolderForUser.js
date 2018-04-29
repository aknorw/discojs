export default function getFolderForUser(username, folderId) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[getFolderForUserMethod] username must be a string (${username})`))
  }
  if (typeof folderId !== 'number') {
    return Promise.reject(new TypeError(`[getFolderForUserMethod] folderId must be a number (${folderId})`))
  }
  return this._fetch({ uri: `/users/${username}/collection/folders/${folderId}` })
}
