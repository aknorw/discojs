export default function removeFromWantlist(username, releaseId) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[removeFromWantlistMethod] username must be a string (${username})`))
  }
  if (typeof releaseId !== 'number') {
    return Promise.reject(new TypeError(`[removeFromWantlistMethod] id must be a number (${releaseId})`))
  }
  return this._fetch({
    uri: `/users/${username}/wants/${releaseId}`,
    options: {
      method: 'DELETE',
    },
  })
}
