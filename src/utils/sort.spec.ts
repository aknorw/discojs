import { sortBy, SortOrdersEnum } from './sort'

enum FakeEnum {
  FIRST = 'first',
  SECOND = 'second',
}

describe('sort', () => {
  const defaultSortBy = FakeEnum.FIRST

  it('should return default sort options if no options', () => {
    const output = sortBy(defaultSortBy)
    expect(output).toHaveProperty('sort', defaultSortBy)
    expect(output).toHaveProperty('sort_order', SortOrdersEnum.ASC)
  })

  it('should accept a `by` option', () => {
    const sort = { by: FakeEnum.SECOND }
    const output = sortBy(defaultSortBy, sort)
    expect(output).toHaveProperty('sort', sort.by)
  })

  it('should accept a `order` option', () => {
    const sort = { order: SortOrdersEnum.DESC }
    const output = sortBy(defaultSortBy, sort)
    expect(output).toHaveProperty('sort_order', sort.order)
  })
})
