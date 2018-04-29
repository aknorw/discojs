export default function getProfile(username) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[getProfileMethod] username must be a string (${username})`))
  }
  return this._fetch({ uri: `/users/${username}` })
}
