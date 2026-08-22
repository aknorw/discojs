jest.mock('cross-fetch', () => ({
  __esModule: true,
  ...jest.requireActual('cross-fetch'),
  default: jest.fn(),
}))

// `jest.setup.ts` builds a client, which pulls in the real `cross-fetch` before this file is
// evaluated. Drop the registry so the fetcher under test is built against the mock above.
jest.resetModules()

/* eslint-disable @typescript-eslint/no-require-imports */
// Take `Headers` from cross-fetch rather than the global: the library uses that implementation,
// and the global is not exposed inside every supported jest environment.
const { default: mockedFetch, Headers: FetchHeaders } = require('cross-fetch') as {
  default: jest.Mock
  Headers: typeof globalThis.Headers
}
const { Fetcher } = require('./fetch') as typeof import('./fetch')
const { DiscogsError } = require('../errors') as typeof import('../errors')
/* eslint-enable @typescript-eslint/no-require-imports */

function respondWith(status: number, headers: Record<string, string>) {
  mockedFetch.mockResolvedValue({
    status,
    statusText: status === 200 ? 'OK' : 'Too Many Requests',
    headers: new FetchHeaders(headers),
    json: async () => ({}),
    blob: async () => ({}),
  })
}

describe('onRateLimit', () => {
  beforeEach(() => mockedFetch.mockReset())

  it('should report the numbers Discogs sent', async () => {
    respondWith(200, {
      'X-Discogs-Ratelimit': '60',
      'X-Discogs-Ratelimit-Used': '12',
      'X-Discogs-Ratelimit-Remaining': '48',
    })
    const onRateLimit = jest.fn()
    await new Fetcher({ userToken: 'token', onRateLimit }).schedule('/releases/1')

    expect(onRateLimit).toHaveBeenCalledTimes(1)
    expect(onRateLimit).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 60,
        used: 12,
        remaining: 48,
        status: 200,
        url: 'https://api.discogs.com/releases/1',
      }),
    )
  })

  it('should leave absent headers undefined rather than NaN', async () => {
    // The browser case: the headers are on the wire but unreadable, because Discogs
    // does not name them in Access-Control-Expose-Headers.
    respondWith(200, {})
    const onRateLimit = jest.fn()
    await new Fetcher({ userToken: 'token', onRateLimit }).schedule('/releases/1')

    const info = onRateLimit.mock.calls[0][0]
    expect(info.limit).toBeUndefined()
    expect(info.used).toBeUndefined()
    expect(info.remaining).toBeUndefined()
  })

  it('should report on a 429, not just on success', async () => {
    respondWith(429, {
      'X-Discogs-Ratelimit': '60',
      'X-Discogs-Ratelimit-Used': '61',
      'X-Discogs-Ratelimit-Remaining': '0',
      'Retry-After': '43',
    })
    const onRateLimit = jest.fn()
    const fetcher = new Fetcher({ userToken: 'token', onRateLimit })

    await expect(fetcher.schedule('/releases/1')).rejects.toBeInstanceOf(DiscogsError)
    expect(onRateLimit).toHaveBeenCalledWith(
      expect.objectContaining({ status: 429, remaining: 0, retryAfter: 43 }),
    )
  })

  it('should carry Retry-After onto the thrown error', async () => {
    respondWith(429, { 'Retry-After': '43' })
    const fetcher = new Fetcher({ userToken: 'token' })

    await expect(fetcher.schedule('/releases/1')).rejects.toMatchObject({
      statusCode: 429,
      retryAfter: 43,
    })
  })

  it('should not let a throwing callback fail the request', async () => {
    respondWith(200, { 'X-Discogs-Ratelimit': '60' })
    const onRateLimit = jest.fn(() => {
      throw new Error('consumer bug')
    })

    await expect(
      new Fetcher({ userToken: 'token', onRateLimit }).schedule('/releases/1'),
    ).resolves.toEqual({})
    expect(onRateLimit).toHaveBeenCalled()
  })
})
