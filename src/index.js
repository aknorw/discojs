import { stringify } from 'querystring'

import createLimiter from './utils/limiter'
import fetch from './utils/fetch'
import bindMethods from './utils/bindMethods'

import { CURRENCIES, RELEASE_CONDITIONS, SLEEVE_CONDITIONS } from './constants'

import * as Database from './database'
import * as Users from './users'
import * as Lists from './lists'
import * as Marketplace from './marketplace'

import { version } from '../package.json'

const BASE_URL = 'https://api.discogs.com'
const API_VERSION = 'v2'
const DEFAULT_USER_AGENT = `Discojs/${version}`
const OUTPUT_FORMATS = ['discogs', 'plaintext', 'html']
const DEFAULT_OUTPUT_FORMAT = OUTPUT_FORMATS[0]

export default class Discojs {
  constructor({
    userAgent = DEFAULT_USER_AGENT,
    outputFormat = DEFAULT_OUTPUT_FORMAT,
    userToken,
    consumerKey,
    consumerSecret,
    requestLimit = 25,
    requestLimitAuth = 60,
    requestLimitInterval = 60 * 1000,
    fetchOptions,
  } = {}) {
    if (typeof userAgent !== 'string') {
      throw new TypeError(`[Constructor] userAgent must be a string (${userAgent})`)
    }
    this.userAgent = userAgent
    if (typeof outputFormat !== 'string' || !OUTPUT_FORMATS.includes(outputFormat)) {
      throw new TypeError(`[Constructor] outputFormat must be one of ${OUTPUT_FORMATS.join(' / ')} (${outputFormat})`)
    }
    this.outputFormat = outputFormat
    if (typeof requestLimitInterval !== 'number') {
      throw new TypeError(`[Constructor] requestLimitInterval must be a number (${requestLimitInterval})`)
    }
    if (userToken || (consumerKey && consumerSecret)) {
      if (typeof requestLimitAuth !== 'number') {
        throw new TypeError(`[Constructor] requestLimitAuth must be a number (${requestLimitAuth})`)
      }
      this.limiter = createLimiter({ maxRequests: requestLimitAuth, requestLimitInterval })
      if (userToken) {
        if (typeof userToken !== 'string') {
          throw new TypeError(`[Constructor] userToken must be a string (${userToken})`)
        }
        this.auth = {
          level: 2,
          userToken,
        }
      } else {
        if (typeof consumerKey !== 'string') {
          throw new TypeError(`[Constructor] consumerKey must be a string (${consumerKey})`)
        }
        if (typeof consumerSecret !== 'string') {
          throw new TypeError(`[Constructor] consumerSecret must be a string (${consumerSecret})`)
        }
        this.auth = {
          level: 1,
          consumerKey,
          consumerSecret,
        }
      }
    } else {
      if (typeof requestLimit !== 'number') {
        throw new TypeError(`[Constructor] requestLimit must be a number (${requestLimit})`)
      }
      this.limiter = createLimiter({ maxRequests: requestLimit, requestLimitInterval })
    }
    if (fetchOptions) {
      if (typeof fetchOptions !== 'object') {
        throw new TypeError(`[Constructor] fetchOptions must be an object (${fetchOptions})`)
      } else {
        this.fetchOptions = fetchOptions
      }
    } else {
      this.fetchOptions = {}
    }
  }

  static getSupportedCurrencies() {
    return CURRENCIES
  }

  static getReleaseConditions() {
    return RELEASE_CONDITIONS
  }

  static getSleeveConditions() {
    return SLEEVE_CONDITIONS
  }

  _fetch({ uri, query, options = {} }) {
    const { method = 'GET', data = null } = options
    const opt = {
      headers: {
        'User-Agent': this.userAgent,
        Accept: `application/vnd.discogs.${API_VERSION}.${this.outputFormat}+json`,
        'Accept-Encoding': 'gzip,deflate',
        Connection: 'close',
        'Content-Length': 0,
      },
      ...this.fetchOptions,
      method,
    }
    if (data) {
      const d = JSON.stringify(data)
      opt.headers['Content-Type'] = 'application/json'
      opt.headers['Content-Length'] = Buffer.byteLength(d, 'utf8')
      opt.body = d
    }
    if (this.auth) {
      if (this.auth.level === 1) {
        opt.headers.Authorization = `Discogs key=${this.auth.consumerKey}, secret=${this.auth.consumerSecret}`
      } else {
        opt.headers.Authorization = `Discogs token=${this.auth.userToken}`
      }
    }
    return this.limiter.schedule(() =>
      fetch(query && typeof query === 'object' ? `${BASE_URL + uri}?${stringify(query)}` : BASE_URL + uri, opt),
    )
  }
}

bindMethods(
  {
    ...Database,
    ...Users,
    ...Lists,
    ...Marketplace,
  },
  Discojs,
)
