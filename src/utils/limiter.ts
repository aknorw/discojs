import Bottleneck from 'bottleneck'

export type Limiter = Bottleneck

export type LimiterOptions = {
  /** Number of requests per interval for unauthenticated requests. Defaults to 25. */
  requestLimit?: number
  /** Number of requests per interval for authenticated requests. Defaults to 60. */
  requestLimitAuth?: number
  /** Interval to use to throttle requests in ms. Defaults to 60 seconds. */
  requestLimitInterval?: number
}

interface CreateLimiterArgs {
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
export function createLimiter({ maxRequests, requestLimitInterval }: CreateLimiterArgs) {
  return new Bottleneck({
    maxConcurrent: 1,
    minTime: requestLimitInterval / maxRequests,
    reservoir: maxRequests,
    reservoirRefreshAmount: maxRequests,
    reservoirRefreshInterval: requestLimitInterval,
  })
}
