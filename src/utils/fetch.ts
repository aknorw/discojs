import Bottleneck from 'bottleneck'
import crossFetch from 'cross-fetch'
import { stringify } from 'querystring'
import { ErrorResponse } from '../../models'

import { AuthError, DiscogsError } from '../errors'

export type RequestInit = Parameters<typeof crossFetch>[1]
export type Response = ReturnType<typeof crossFetch> extends Promise<infer Q> ? Q : never
export type Blob = ReturnType<Response['blob']> extends Promise<infer Q> ? Q : never
/**
 * HTTP verbs.
 *
 * @internal
 */
export enum HTTPVerbsEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * Fetch helper.
 *
 * @param url - URL to fetch
 * @param options - Fetch options
 * @returns
 * @throws
 *
 * @internal
 */
export async function fetch<T>(
  limiter: Bottleneck,
  url: string,
  options?: RequestInit,
  shouldReturnBlob?: boolean,
): Promise<T> {
  const response = await limiter.schedule(crossFetch.bind(null, url, options))

  // Check status
  const { status, statusText } = response

  if (status === 401) throw new AuthError()

  if (status === 422 || status >= 500) {
    const { message }: ErrorResponse = await response.json()
    // eslint-disable-next-line no-console
    console.log({ status, statusText, message })
    throw new DiscogsError(message, status)
  }

  if (status < 200 || status >= 300) {
    throw new DiscogsError(statusText, status)
  }

  if (status === 204) return Promise.resolve({}) as Promise<T>

  if (shouldReturnBlob) {
    const blob = await response.blob()
    return blob as unknown as T
  }

  const data = await response.json()
  return data
}

/**
 * Helper to add query to a URI. Strips undefined values.
 *
 * @param uri - Endpoint to which query will be appended.
 * @param query
 * @returns URI + query
 *
 * @internal
 */
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

/**
 * Helper to transform camelcased data keys to snakecased one and rename `currency` to `curr_abbr`.
 *
 * @param data
 * @returns Tranformed `data` object.
 *
 * @internal
 */
export function transformData(data: Record<string, any>) {
  return Object.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key === 'currency' ? 'curr_abbr' : key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)]: value,
    }),
    {} as Record<string, any>,
  )
}
