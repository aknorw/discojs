import Bottleneck from 'bottleneck'

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
