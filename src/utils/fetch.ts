import crossFetch, { Headers } from 'cross-fetch'

import { ErrorResponse, PaginationResponse } from '../../models'
import { AuthError, DiscogsError } from '../errors'
import { AuthOptions, isAuthenticated, makeSetAuthorizationHeader, SetAuthorizationHeaderFunction } from './auth'
import { createLimiter, Limiter, LimiterOptions } from './limiter'
import { Pagination } from './paginate'

type RequestInit = Parameters<typeof crossFetch>[1]
type Response = ReturnType<typeof crossFetch> extends Promise<infer Q> ? Q : never
export type Blob = ReturnType<Response['blob']> extends Promise<infer Q> ? Q : never

/** Base API URL to which URI will be appended. */
const API_BASE_URL = 'https://api.discogs.com'

/** Base URL dedicated to Discogs images. */
const IMG_BASE_URL = 'https://img.discogs.com'

/** Discogs API version. */
const API_VERSION = 'v2'

/** Default user-agent to be used in requests. */
const DEFAULT_USER_AGENT = `Discojs/__packageVersion__`

/** Header set by Discogs API to indicate the total number of requests you can make in a one minute window. */
const RATE_LIMIT_HEADER = 'X-Discogs-Ratelimit'

/** Header set by Discogs API to indicate the number of remaining requests you are able to make in the existing rate limit window. */
const RATE_LIMIT_REMAINING_HEADER = 'X-Discogs-Ratelimit-Remaining'

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

// @TODO: Support other output formats.
export type OutputFormat = 'discogs' // | 'plaintext' | 'html'

/**
 * A cache for the results of fetches.
 */
export type ResultCache = {
  /**
   * If the result of a given request is in your cache, return it.
   * Otherwise, invoke and return the factory.
   *
   * @param factory method to get current content
   * @param args fetch arguments (headers, query parameters, data, etc.)
   */
  get<T>(factory: () => Promise<T>, ...args: Parameters<typeof crossFetch>): Promise<T>
}

export type FetcherOptions = Partial<AuthOptions> &
  LimiterOptions & {
    /**
     * User-agent to be used in requests.
     *
     * @default Discojs/{packageVersion}
     */
    userAgent?: string
    /**
     * Output format.
     *
     * @default discogs
     */
    outputFormat?: OutputFormat

    /**
     * Additional fetch options.
     */
    fetchOptions?: RequestInit

    /**
     * Optional cache for requests
     */
    cache?: ResultCache

    /**
     * Set to `false` for use in a browser.
     *
     * @default `true`
     */
    allowUnsafeHeaders?: boolean
  }

export class Fetcher {
  public userAgent: string
  public outputFormat: OutputFormat

  private headers: Headers
  private setAuthorizationHeader?: SetAuthorizationHeaderFunction
  private options: RequestInit

  private maxRequests: number
  private reservoirRefreshInterval: number
  private limiter: Limiter
  private cache: ResultCache | undefined

  constructor(options: FetcherOptions) {
    const {
      requestLimit = 25,
      requestLimitAuth = 60,
      requestLimitInterval = 60 * 1000,
      userAgent = DEFAULT_USER_AGENT,
      outputFormat = 'discogs',
      fetchOptions = {},
      cache = undefined,
      allowUnsafeHeaders = true,
    } = options || {}

    this.userAgent = userAgent

    this.outputFormat = outputFormat

    const unsafeHeadersInit: HeadersInit = allowUnsafeHeaders
      ? {
          'Accept-Encoding': 'gzip,deflate',
          Connection: 'close',
          'User-Agent': userAgent,
        }
      : {}

    this.headers = new Headers({
      Accept: `application/vnd.discogs.${API_VERSION}.${outputFormat}+json`,
      'Content-Type': 'application/json',
      ...unsafeHeadersInit,
    })

    this.setAuthorizationHeader = makeSetAuthorizationHeader(options)

    this.options = fetchOptions

    this.maxRequests = isAuthenticated(options) ? requestLimitAuth : requestLimit
    this.reservoirRefreshInterval = requestLimitInterval

    this.limiter = createLimiter({
      maxRequests: this.maxRequests,
      requestLimitInterval: this.reservoirRefreshInterval,
    })

    this.cache = cache
  }

  private updateMaxRequests(maxRequests: number) {
    this.limiter.updateSettings({
      minTime: this.reservoirRefreshInterval / maxRequests,
      reservoir: maxRequests,
      reservoirRefreshAmount: maxRequests,
    })
  }

  private updateRemainingRequests(remainingRequests: number) {
    this.limiter.updateSettings({ reservoir: remainingRequests })
  }

  private maybeUpdateLimiter(headers: Headers) {
    const rateLimit = parseInt(headers.get(RATE_LIMIT_HEADER) ?? '', 10)
    const rateLimitRemaining = parseInt(headers.get(RATE_LIMIT_REMAINING_HEADER) ?? '', 10)

    // Update max requests only if lower than the current value.
    if (!Number.isNaN(rateLimit) && rateLimit < this.maxRequests) {
      this.updateMaxRequests(rateLimit)
    }

    if (!Number.isNaN(rateLimitRemaining)) {
      this.updateRemainingRequests(rateLimitRemaining)
    }
  }

  private async fetch<T>(url: string, options?: RequestInit, shouldReturnBlob?: boolean): Promise<T> {
    const response = await crossFetch(url, options)
    const { status, statusText, headers } = response

    this.maybeUpdateLimiter(headers)

    // Check status
    if (status === 401) {
      throw new AuthError()
    }

    if (status === 422 || status >= 500) {
      const { message, detail }: ErrorResponse = await response.json()
      const errorMessage = detail ? detail.map((e) => `${e.loc.join('.')}: ${e.msg} (${e.type})`).join('\n') : message
      throw new DiscogsError(errorMessage, status)
    }

    if (status < 200 || status >= 300) {
      throw new DiscogsError(statusText, status)
    }

    if (status === 204) {
      return Promise.resolve({}) as Promise<T>
    }

    if (shouldReturnBlob) {
      const blob = await response.blob()
      return blob as unknown as T
    }

    const data = await response.json()
    return data
  }

  /**
   * Method used within other methods to schedule fetching from the Discogs API.
   *
   * @internal
   */
  async schedule<T>(uri: string, query?: Record<string, any>, method?: HTTPVerbsEnum, data?: Record<string, any>) {
    const isImgEndpoint = uri.startsWith(IMG_BASE_URL)
    const endpoint = isImgEndpoint
      ? uri
      : API_BASE_URL + (query && typeof query === 'object' ? Fetcher.addQueryToUri(uri, query) : uri)

    const isCsvEndpoint = uri.endsWith('/download')

    const options = {
      ...this.options,
      method: method || HTTPVerbsEnum.GET,
    }

    // Set Authorization header.
    if (this.setAuthorizationHeader)
      this.headers.set('Authorization', this.setAuthorizationHeader(uri, method || HTTPVerbsEnum.GET))

    const clonedHeaders = new Map(this.headers)

    if (data) {
      const stringifiedData = JSON.stringify(Fetcher.transformData(data))
      options.body = stringifiedData

      clonedHeaders.set('Content-Type', 'application/json')
      clonedHeaders.set('Content-Length', Buffer.byteLength(stringifiedData, 'utf8').toString())
    }

    options.headers = Object.fromEntries(clonedHeaders)

    const execute = () => this.limiter.schedule(() => this.fetch<T>(endpoint, options, isImgEndpoint || isCsvEndpoint))

    return this.cache?.get(execute, endpoint, options) ?? execute()
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
  static addQueryToUri(uri: string, query: Record<string, any>) {
    const params = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
      if (typeof value !== 'undefined') {
        params.append(key, value)
      }
    })

    return `${uri}?${params.toString()}`
  }

  /**
   * Helper to transform camelcased data keys to snakecased one and rename `currency` to `curr_abbr`.
   *
   * @param data
   * @returns Tranformed `data` object.
   *
   * @internal
   */
  static transformData(data: Record<string, any>) {
    return Object.entries(data).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key === 'currency' ? 'curr_abbr' : key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)]: value,
      }),
      {} as Record<string, any>,
    )
  }

  async *createAllMethod<T extends { pagination: PaginationResponse }>(
    fetchFunction: (pagination?: Pagination) => Promise<T>,
  ): AsyncGenerator<Omit<T, 'pagination'>> {
    let currentPage = 1
    let lastPage = 1

    do {
      const { pagination, ...data } = await fetchFunction({
        page: currentPage,
        perPage: 100, // Use maximum value to reduce the number of requests.
      })
      lastPage = pagination.pages
      yield data
      currentPage += 1
    } while (currentPage <= lastPage)
  }
}
