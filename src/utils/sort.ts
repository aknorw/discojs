export enum SortOrdersEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortOptions<T> {
  by?: T
  order?: SortOrdersEnum
}

export function sortBy<T>(defaultSortBy: T, options?: SortOptions<T>) {
  const { by = defaultSortBy, order = SortOrdersEnum.ASC } = options || {}

  return {
    sort: by,
    sort_order: order,
  }
}
