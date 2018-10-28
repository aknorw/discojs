import { CURRENCIES } from '../../constants'

export default function editProfile(username, { name, homepage, location, profile, currency } = {}) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[editProfileMethod] username must be a string (${username})`))
  }
  const data = {}
  if (name) {
    if (typeof name === 'string') {
      data.name = name
    } else {
      return Promise.reject(new TypeError(`[editProfileMethod] name must be a string (${name})`))
    }
  }
  if (homepage) {
    if (typeof homepage === 'string') {
      data.home_page = homepage
    } else {
      return Promise.reject(new TypeError(`[editProfileMethod] homepage must be a string (${homepage})`))
    }
  }
  if (location) {
    if (typeof location === 'string') {
      data.location = location
    } else {
      return Promise.reject(new TypeError(`[editProfileMethod] location must be a string (${location})`))
    }
  }
  if (profile) {
    if (typeof profile === 'string') {
      data.profile = profile
    } else {
      return Promise.reject(new TypeError(`[editProfileMethod] profile must be a string (${profile})`))
    }
  }
  if (currency) {
    if (typeof currency === 'string' && CURRENCIES.includes(currency)) {
      data.curr_abbr = currency
    } else {
      return Promise.reject(
        new TypeError(`[editProfileMethod] currency must be one of '${CURRENCIES.join(' / ')}' (${currency})`),
      )
    }
  }
  if (Object.keys(data).length === 0) {
    return Promise.reject(new Error('[editProfileMethod] data must be provided'))
  }
  return this._fetch({
    uri: `/users/${username}`,
    options: {
      method: 'POST',
      data,
    },
  })
}
