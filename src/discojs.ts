import { Headers } from 'cross-fetch'

import { CurrenciesEnum, ReleaseConditionsEnum, SleeveConditionsEnum } from './enums'

import { addQueryToUri, createLimiter, fetch, HTTPVerbsEnum, Limiter, LimiterOptions, transformData } from './utils'

import { AuthOptions, isAuthenticated, makeSetAuthorizationHeader, SetAuthorizationHeaderFunction } from './auth'
import { API_BASE_URL, API_VERSION, DEFAULT_USER_AGENT, IMG_BASE_URL } from './constants'
import { UserIdentity } from './userIdentity'
import { applyMixins } from './utils/applyMixins'
import { UserCollection } from './userCollection'
import { UserWantlist } from './userWantlist'
import { UserLists } from './userLists'
import { Database } from './database'
import { MarketPlace } from './marketplace'
import { InventoryExport } from './inventoryExport'
import { InventoryUpload } from './inventoryUpload'

// @TODO: Support other output formats.
type OutputFormat = 'discogs' // | 'plaintext' | 'html'

type DiscojsOptions = Partial<AuthOptions> &
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
    fetchOptions?: RequestInit
  }

/**
 * Discojs.
 */

export interface Discojs
  extends UserIdentity,
    UserCollection,
    UserWantlist,
    UserLists,
    Database,
    MarketPlace,
    InventoryExport,
    InventoryUpload {}

export class Discojs {
  public userAgent: string
  public outputFormat: OutputFormat
  private limiter: Limiter
  private fetchHeaders: Headers
  private setAuthorizationHeader?: SetAuthorizationHeaderFunction
  private fetchOptions: RequestInit

  constructor(options?: DiscojsOptions) {
    const {
      userAgent = DEFAULT_USER_AGENT,
      outputFormat = 'discogs',
      requestLimit = 25,
      requestLimitAuth = 60,
      requestLimitInterval = 60 * 1000,
      fetchOptions = {},
    } = options || {}

    this.userAgent = userAgent

    this.outputFormat = outputFormat

    this.limiter = createLimiter({
      maxRequests: isAuthenticated(options) ? requestLimitAuth : requestLimit,
      requestLimitInterval,
    })

    this.fetchOptions = fetchOptions

    this.fetchHeaders = new Headers({
      Accept: `application/vnd.discogs.${API_VERSION}.${this.outputFormat}+json`,
      'Accept-Encoding': 'gzip,deflate',
      Connection: 'close',
      'Content-Type': 'application/json',
      'User-Agent': this.userAgent,
    })

    this.setAuthorizationHeader = makeSetAuthorizationHeader(options)
  }

  /**
   * Return currencies supported by Discogs.
   *
   * @category Helpers
   *
   * @static
   */
  static getSupportedCurrencies() {
    return Object.values(CurrenciesEnum)
  }

  /**
   * Return release conditions supported by Discogs.
   *
   * @category Helpers
   *
   * @static
   */
  static getReleaseConditions() {
    return Object.values(ReleaseConditionsEnum)
  }

  /**
   * Return slevve conditions supported by Discogs.
   *
   * @category Helpers
   *
   * @static
   */
  static getSleeveConditions() {
    return Object.values(SleeveConditionsEnum)
  }

  /**
   * Private method used within other methods.
   *
   * @protected
   * @internal
   */
  protected async fetch<T>(
    uri: string,
    query?: Record<string, any>,
    method?: HTTPVerbsEnum,
    data?: Record<string, any>,
  ) {
    const isImgEndpoint = uri.startsWith(IMG_BASE_URL)
    const endpoint = isImgEndpoint
      ? uri
      : API_BASE_URL + (query && typeof query === 'object' ? addQueryToUri(uri, query) : uri)

    const options = {
      ...this.fetchOptions,
      method: method || HTTPVerbsEnum.GET,
    }

    // Set Authorization header.
    if (this.setAuthorizationHeader)
      this.fetchHeaders.set('Authorization', this.setAuthorizationHeader(uri, method || HTTPVerbsEnum.GET))

    const clonedHeaders = new Map(this.fetchHeaders)

    if (data) {
      const stringifiedData = JSON.stringify(transformData(data))
      options.body = stringifiedData

      clonedHeaders.set('Content-Type', 'application/json')
      clonedHeaders.set('Content-Length', Buffer.byteLength(stringifiedData, 'utf8').toString())
    }

    options.headers = Object.fromEntries(clonedHeaders)

    return this.limiter.schedule(() => fetch<T>(endpoint, options, isImgEndpoint))
  }

  /**
   * Retrieve an image retrieved in another response.
   *
   * @requires authentication
   *
   * @category Helpers
   *
   * @link https://www.discogs.com/developers#page:images
   */
  async fetchImage(imageUrl: string) {
    return this.fetch<Blob>(imageUrl)
  }
}

applyMixins(Discojs, [
  UserIdentity,
  UserCollection,
  UserWantlist,
  UserLists,
  Database,
  MarketPlace,
  InventoryExport,
  InventoryUpload,
])
