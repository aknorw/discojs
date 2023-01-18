import OAuth from 'oauth-1.0a'

import { HTTPVerbsEnum } from './utils'

type UserTokenAuth = {
  /** User token. */
  userToken: string
}

/**
 * Type guard to check if authenticated thanks to user token.
 *
 * @internal
 */
function isAuthenticatedWithToken(options?: Record<string, unknown>): options is UserTokenAuth {
  return !!options && 'userToken' in options && typeof options.userToken === 'string'
}

type ConsumerKeyAuth = {
  /** Consumer key. */
  consumerKey: string
  /** Consumer secret. */
  consumerSecret: string
  /** OAuth token. */
  oAuthToken: string
  /** OAuth token secret. */
  oAuthTokenSecret: string
}

/**
 * Type guard to check if authenticated thanks to consumer key.
 *
 * @internal
 */
function isAuthenticatedWithConsumerKey(options?: Record<string, unknown>): options is ConsumerKeyAuth {
  return (
    !!options &&
    'consumerKey' in options &&
    typeof options.consumerKey === 'string' &&
    'consumerSecret' in options &&
    typeof options.consumerSecret === 'string' &&
    'oAuthToken' in options &&
    typeof options.oAuthToken === 'string' &&
    'oAuthTokenSecret' in options &&
    typeof options.oAuthTokenSecret === 'string'
  )
}

export type AuthOptions = UserTokenAuth | ConsumerKeyAuth

/**
 * Type guard to check whether requests are authenticated or not.
 *
 * @internal
 */
export function isAuthenticated(options?: Partial<AuthOptions>) {
  return isAuthenticatedWithToken(options) || isAuthenticatedWithConsumerKey(options)
}

export type SetAuthorizationHeaderFunction = (url?: string, method?: HTTPVerbsEnum) => string

/**
 * Helper to create a function to set the Authorization header based on the authentication strategy.
 *
 * @internal
 */
export function makeSetAuthorizationHeader(options?: Partial<AuthOptions>): SetAuthorizationHeaderFunction | undefined {
  if (isAuthenticatedWithToken(options)) return () => `Discogs token=${options.userToken}`

  if (isAuthenticatedWithConsumerKey(options)) {
    const oAuth = new OAuth({
      consumer: { key: options.consumerKey, secret: options.consumerSecret },
      signature_method: 'PLAINTEXT',
      version: '1.0',
    })

    return (url?: string, method?: HTTPVerbsEnum) => {
      if (!url || !method) return ''

      const authObject = oAuth.authorize({ url, method }, { key: options.oAuthToken, secret: options.oAuthTokenSecret })

      return oAuth.toHeader(authObject).Authorization
    }
  }

  return undefined
}
