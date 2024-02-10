import { Fetcher } from './fetch'

describe('addQueryToUri', () => {
  const uri = '/test'
  const query: Record<string, any> = {
    param1: 42,
    param2: '1337',
  }

  it('should add query params to URI', () => {
    const output = Fetcher.addQueryToUri(uri, query)
    const [, params] = output.split('?')
    const splitParams = params.split('&')
    expect(splitParams.length).toEqual(2)
    Object.keys(query).forEach((param) => {
      const splitParam = splitParams.find((p) => p.startsWith(param))
      expect(splitParam).toEqual(`${param}=${query[param]}`)
    })
  })

  it('should remove undefined values', () => {
    const output = Fetcher.addQueryToUri(uri, { ...query, param2: undefined })
    const [, params] = output.split('?')
    const splitParams = params.split('&')
    expect(splitParams.length).toEqual(1)
    expect(splitParams.find((p) => p.startsWith('param2'))).toBeUndefined()
  })
})

describe('transformData', () => {
  it('should transform camelcased keys to snakecased ones', () => {
    const data = {
      firstParam: 42,
      secondParam: '1337',
    }
    const output = Fetcher.transformData(data)
    Object.keys(output).forEach((key) => {
      expect(/[A-Z]/.test(key)).toBeFalsy()
    })
  })

  it('should replace `currency` by `curr_abbr`', () => {
    const output = Fetcher.transformData({
      currency: 'test',
    })
    expect(output).toHaveProperty('curr_abbr')
  })
})
