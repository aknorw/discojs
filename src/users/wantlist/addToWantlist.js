export default function addToWantlist({ username, releaseId, notes, rating = 0 } = {}) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[addToWantlistMethod] username must be a string (${username})`))
  }
  if (typeof releaseId !== 'number') {
    return Promise.reject(new TypeError(`[addToWantlistMethod] releaseId must be a number (${releaseId})`))
  }
  const data = {}
  if (notes) {
    if (typeof notes === 'string') {
      data.notes = notes
    } else {
      return Promise.reject(new TypeError(`[addToWantlistMethod] notes must be a string (${notes})`))
    }
  }
  if (typeof rating === 'number') {
    data.rating = rating
  } else {
    return Promise.reject(new TypeError(`[addToWantlistMethod] rating must be a number (${rating})`))
  }
  return this._fetch({
    uri: `/users/${username}/wants/${releaseId}`,
    options: {
      method: 'PUT',
      data,
    },
  })
}
