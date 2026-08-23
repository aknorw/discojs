import { createLimiter, Limiter } from './limiter'

function settings(limiter: Limiter) {
  return (limiter as unknown as { _store: { storeOptions: { maxConcurrent: number; minTime: number } } })._store
    .storeOptions
}

describe('createLimiter', () => {
  it('should serialize requests by default', () => {
    const limiter = createLimiter({ maxRequests: 60, requestLimitInterval: 60_000 })
    expect(settings(limiter).maxConcurrent).toEqual(1)
  })

  it('should allow requests to overlap when asked', () => {
    const limiter = createLimiter({ maxRequests: 60, requestLimitInterval: 60_000, maxConcurrent: 5 })
    expect(settings(limiter).maxConcurrent).toEqual(5)
  })

  it('should still space requests by the rate limit', () => {
    // Concurrency must not widen the rate: minTime is derived from the limit either way.
    const serial = createLimiter({ maxRequests: 48, requestLimitInterval: 60_000 })
    const parallel = createLimiter({ maxRequests: 48, requestLimitInterval: 60_000, maxConcurrent: 5 })
    expect(settings(serial).minTime).toEqual(1250)
    expect(settings(parallel).minTime).toEqual(1250)
  })
})
