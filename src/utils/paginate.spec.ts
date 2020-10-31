import { DEFAULT_PAGE, DEFAULT_PER_PAGE, paginate } from './paginate'

describe('paginate', () => {
  it('should return default pagination options if no param', () => {
    const output = paginate()
    expect(output).toHaveProperty('page', DEFAULT_PAGE)
    expect(output).toHaveProperty('per_page', DEFAULT_PER_PAGE)
  })

  it('should accept `page` option', () => {
    const page = 5
    const output = paginate({ page })
    expect(output).toHaveProperty('page', page)
  })

  it('should use default `page` option if <= 0', () => {
    const page = -2
    const output = paginate({ page })
    expect(output).toHaveProperty('page', DEFAULT_PAGE)
  })

  it('should accept `perPage` option', () => {
    const perPage = 10
    const output = paginate({ perPage })
    expect(output).toHaveProperty('per_page', perPage)
  })

  it('should use default `perPage` option if <= 0', () => {
    const perPage = -10
    const output = paginate({ perPage })
    expect(output).toHaveProperty('per_page', DEFAULT_PER_PAGE)
  })

  it('should use default `perPage` option if > 100', () => {
    const perPage = 200
    const output = paginate({ perPage })
    expect(output).toHaveProperty('per_page', DEFAULT_PER_PAGE)
  })
})
