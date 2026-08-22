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

/** Headers the fetcher passed to `crossFetch` on its most recent call. */
function sentHeaders() {
  const [, options] = mockedFetch.mock.calls[mockedFetch.mock.calls.length - 1]
  return options.headers as Record<string, string>
}

describe('request headers', () => {
  beforeEach(() => {
    mockedFetch.mockReset()
    mockedFetch.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: new FetchHeaders(),
      json: async () => ({}),
    })
  })

  it('should not send a header name twice under two casings', async () => {
    const fetcher = new Fetcher({ userAgent: 'Discojs/Test/0.0.0', userToken: 'token' })
    await fetcher.schedule('/test', undefined, HTTPVerbsEnum.POST, { value: 'test' })

    const names = Object.keys(sentHeaders()).map((name) => name.toLowerCase())
    expect(names).toEqual([...new Set(names)])
  })

  it('should send a single Content-Type on a request with a body', async () => {
    const fetcher = new Fetcher({ userAgent: 'Discojs/Test/0.0.0', userToken: 'token' })
    await fetcher.schedule('/test', undefined, HTTPVerbsEnum.POST, { value: 'test' })

    // A `Headers` joins repeated names with a comma, which is how the duplicate reaches Discogs.
    expect(new FetchHeaders(sentHeaders()).get('content-type')).toEqual('application/json')
  })
})
