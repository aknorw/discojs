import fetch from 'isomorphic-fetch'

import { AuthError, DiscogsError } from '../errors'

export default (url, options = {}) =>
  new Promise((resolve, reject) =>
    fetch(url, options)
      .then((response) => {
        const { status, statusText } = response
        if (status === 401) {
          return reject(new AuthError())
        }
        if (status < 200 || status >= 300) {
          return reject(new DiscogsError({ message: statusText, statusCode: status }))
        }
        if (status === 204) {
          return resolve({ statusCode: status })
        }
        return response
          .json()
          .then((data) => resolve(data))
          .catch((err) => reject(err))
      })
      .catch((err) => reject(err)),
  )
