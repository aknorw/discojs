export default function listFoldersForUser(username) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[listFoldersForUserMethod] username must be a string (${username})`))
  }
  return this._fetch({ uri: `/users/${username}/collection/folders` })
}
