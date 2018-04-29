export default function createFolderForUser(username, name) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[createFolderForUserMethod] username must be a string (${username})`))
  }
  if (typeof name !== 'string') {
    return Promise.reject(new TypeError(`[createFolderForUserMethod] name must be a string (${name})`))
  }
  return this._fetch({
    uri: `/users/${username}/collection/folders`,
    options: {
      method: 'POST',
      data: {
        username,
        name,
      },
    },
  })
}
