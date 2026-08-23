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
const { Fetcher, HTTPVerbsEnum } = require('./fetch') as typeof import('./fetch')
/* eslint-enable @typescript-eslint/no-require-imports */

/** URL the fetcher passed to `crossFetch` on its most recent call. */
function requestedUrl() {
  const [url] = mockedFetch.mock.calls[mockedFetch.mock.calls.length - 1]
  return url as string
}

/** A cache that records the URL it is keyed on and otherwise stays out of the way. */
function recordingCache() {
  const keys: string[] = []
  return {
    keys,
    get<T>(factory: () => Promise<T>, ...args: Parameters<typeof fetch>) {
      keys.push(args[0] as string)
      return factory()
    },
  }
}

describe('apiBaseUrl', () => {
  beforeEach(() => {
    mockedFetch.mockReset()
    mockedFetch.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: new FetchHeaders(),
      json: async () => ({}),
      // Image and CSV-export endpoints are read as blobs rather than JSON.
      blob: async () => ({}),
    })
  })

  it('should default to the Discogs API', async () => {
    const fetcher = new Fetcher({ userToken: 'token' })
    await fetcher.schedule('/releases/1')

    expect(requestedUrl()).toEqual('https://api.discogs.com/releases/1')
  })

  it('should send requests to the configured base URL', async () => {
    const fetcher = new Fetcher({ userToken: 'token', apiBaseUrl: 'https://proxy.example' })
    await fetcher.schedule('/releases/1')

    expect(requestedUrl()).toEqual('https://proxy.example/releases/1')
  })

  it('should tolerate a trailing slash', async () => {
    const fetcher = new Fetcher({ userToken: 'token', apiBaseUrl: 'https://proxy.example/' })
    await fetcher.schedule('/releases/1')

    expect(requestedUrl()).toEqual('https://proxy.example/releases/1')
  })

  it('should carry the query string across', async () => {
    const fetcher = new Fetcher({ userToken: 'token', apiBaseUrl: 'https://proxy.example' })
    await fetcher.schedule('/database/search', { query: 'nevermind' })

    expect(requestedUrl()).toEqual('https://proxy.example/database/search?query=nevermind')
  })

  it('should key the cache on the canonical URL, not the base URL', async () => {
    // This is the point of the whole split: pointing at a proxy must not invalidate a
    // consumer's cache or change what its cache-clearing patterns match.
    const cache = recordingCache()
    const fetcher = new Fetcher({ userToken: 'token', apiBaseUrl: 'https://proxy.example', cache })
    await fetcher.schedule('/releases/1')

    expect(cache.keys).toEqual(['https://api.discogs.com/releases/1'])
    expect(requestedUrl()).toEqual('https://proxy.example/releases/1')
  })

  it('should leave image requests alone', async () => {
    const fetcher = new Fetcher({ userToken: 'token', apiBaseUrl: 'https://proxy.example' })
    await fetcher.schedule('https://img.discogs.com/some-image.jpg')

    expect(requestedUrl()).toEqual('https://img.discogs.com/some-image.jpg')
  })

  it('should apply to non-GET requests too', async () => {
    const fetcher = new Fetcher({ userToken: 'token', apiBaseUrl: 'https://proxy.example' })
    await fetcher.schedule('/test', undefined, HTTPVerbsEnum.POST, { value: 'test' })

    expect(requestedUrl()).toEqual('https://proxy.example/test')
  })
})
