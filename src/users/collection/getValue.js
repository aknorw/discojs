export default function getValue(username) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[getValueMethod] username must be a string (${username})`))
  }
  return this._fetch({ uri: `/users/${username}/collection/value` })
}
