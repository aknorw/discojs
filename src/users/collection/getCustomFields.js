export default function getCustomFields(username) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[getCustomFieldsMethod] username must be a string (${username})`))
  }
  return this._fetch({ uri: `/users/${username}/collection/fields` })
}
