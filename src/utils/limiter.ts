import Bottleneck from 'bottleneck'

export type Limiter = Bottleneck

export type LimiterOptions = {
  /** Number of requests per interval for unauthenticated requests. Defaults to 25. */
  requestLimit?: number
  /** Number of requests per interval for authenticated requests. Defaults to 60. */
  requestLimitAuth?: number
  /** Interval to use to throttle requests in ms. Defaults to 60 seconds. */
  requestLimitInterval?: number
  /**
   * How many requests may be in flight at once. Defaults to 1.
   *
   * This is independent of the rate limit: `minTime` still spaces request *starts*, so
   * raising this cannot exceed the configured requests-per-interval. What it does fix is
   * throughput collapsing to `1 / latency` when a response takes longer than `minTime` --
   * with the default of 1, a 2s response caps you at 30 requests/minute however high the
   * rate limit is.
   */
  maxConcurrent?: number
}

interface CreateLimiterArgs {
  /** How many jobs can be executed before the limiter stops executing jobs. */
  maxRequests: number
  /** Every `requestLimitInterval` ms, number of requests will be reset. */
  requestLimitInterval: number
  /** How many requests may be in flight at once. */
  maxConcurrent?: number
}

/**
 * Helper to create a new instance of Bottleneck.
 *
 * @internal
 */
export function createLimiter({ maxRequests, requestLimitInterval, maxConcurrent = 1 }: CreateLimiterArgs) {
  return new Bottleneck({
    maxConcurrent,
    minTime: requestLimitInterval / maxRequests,
    reservoir: maxRequests,
    reservoirRefreshAmount: maxRequests,
    reservoirRefreshInterval: requestLimitInterval,
  })
}
