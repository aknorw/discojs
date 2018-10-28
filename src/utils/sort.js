export const sortOrders = ['asc', 'desc']

export default ({ by, order } = {}, fields) => {
  if (!Array.isArray(fields) || (Array.isArray(fields) && fields.length < 1)) {
    throw new TypeError('[Sort] sortFields must be a non-empty array')
  }
  return {
    sort: fields.includes(by) ? by : fields[0],
    sort_order: sortOrders.includes(order) ? order : sortOrders[0],
  }
}
