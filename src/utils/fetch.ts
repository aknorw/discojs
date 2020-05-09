import crossFetch from 'cross-fetch'
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

  // if (status === 204) throw new DiscogsError(statusText, 204)
  // TODO: Check if we can response.json with 204 (i.e. deleted)

  const data = await response.json()
  return data
}
