export interface Pagination {
  /** Page to display, default to 1. */
  page?: number
  /** Number of items per page, default to 50. */
  perPage?: number
}

export const DEFAULT_PAGE = 1
export const DEFAULT_PER_PAGE = 50

/**
 * Paginate helper.
 *
 * @internal
 */
export function paginate(options?: Pagination) {
  const { page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE } = options || {}

  return {
    // Minimum page is 1
    page: Math.max(DEFAULT_PAGE, page),
    // Maximum items per page are 100
    per_page: perPage <= 0 || perPage > 100 ? DEFAULT_PER_PAGE : perPage,
  }
}
