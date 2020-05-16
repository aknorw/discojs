import crossFetch from 'cross-fetch'
import { stringify } from 'querystring'

import { AuthError, DiscogsError } from '../errors'

export enum HTTPVerbsEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export async function fetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await crossFetch(url, options)

  // Check status
  const { status, statusText } = response

  if (status === 401) throw new AuthError()

  if (status < 200 || status >= 300) throw new DiscogsError(statusText, status)

  if (status === 204) return Promise.resolve({}) as Promise<T>

  const data = await response.json()
  return data
}

export function addQueryToUri(uri: string, query: Record<string, any>) {
  const definedKeys = Object.entries(query).reduce((acc, [key, value]) => {
    if (typeof value === 'undefined') return acc

    return {
      ...acc,
      [key]: value,
    }
  }, {} as Record<string, any>)
  return `${uri}?${stringify(definedKeys)}`
}

// We must replace `currency` by `curr_abbr` and transform camelcase to snakecase.
export function transformData(data: Record<string, any>) {
  return Object.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key === 'currency' ? 'curr_abbr' : key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)]: value,
    }),
    {} as Record<string, any>,
  )
}
