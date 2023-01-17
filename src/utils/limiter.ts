import Bottleneck from 'bottleneck'

export type Limiter = Bottleneck

// @TODO: Make a better limiter (one limit, no interval, should use headers from Discogs).
export type LimiterOptions = {
  /** Number of requests per interval for unauthenticated requests. Defaults to 25. */
  requestLimit?: number
  /** Number of requests per interval for authenticated requests. Defaults to 60. */
  requestLimitAuth?: number
  /** Interval to use to throttle requests. Defaults to 60 seconds. */
  requestLimitInterval?: number
}

interface CreateLimiterArgs {
  /** How many jobs can be executed at the same time. */
  concurrency?: number
  /** How many jobs can be executed before the limiter stops executing jobs. */
  maxRequests: number
  /** Every `requestLimitInterval` ms, number of requests will be reset. */
  requestLimitInterval: number
}

/**
 * Helper to create a new instance of Bottleneck.
 *
 * @internal
 */
export function createLimiter({ concurrency = 1, maxRequests, requestLimitInterval }: CreateLimiterArgs) {
  return new Bottleneck({
    maxConcurrent: concurrency,
    minTime: requestLimitInterval / maxRequests,
    reservoir: maxRequests,
    reservoirRefreshAmount: maxRequests,
    reservoirRefreshInterval: requestLimitInterval,
  })
}
