export default ({ page = 1, perPage = 50 } = {}) => {
  if (typeof page !== 'number') {
    throw new TypeError(`[Paginate] page must be a number (${page})`)
  }
  if (typeof perPage !== 'number') {
    throw new TypeError(`[Paginate] perPage must be a number (${perPage})`)
  }
  const pagination = {
    page,
    per_page: perPage,
  }
  if (page <= 0) {
    pagination.page = 1
  }
  if (perPage <= 0 || perPage > 100) {
    pagination.per_page = 50
  }
  return pagination
}
