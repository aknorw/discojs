export interface Pagination {
  /** Page to display, default to 1. */
  page?: number
  /** Number of items per page, default to 50. */
  perPage?: number
}

export function paginate(options?: Pagination) {
  const { page = 1, perPage = 50 } = options || {}

  return {
    // Minimum page is 1
    page: Math.max(1, page),
    // Maximum items per page are 100
    per_page: Math.min(100, perPage),
  }
}
