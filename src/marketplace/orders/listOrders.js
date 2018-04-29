import paginate from '../../utils/paginate'
import sortBy from '../../utils/sort'

import { ORDER_STATUSES } from '../../constants'

const sortFields = [
  'id',
  'buyer',
  'created',
  'status',
  'last_activity',
]

export default function listOrders({ status = ORDER_STATUSES[0], pagination, sort } = {}) {
  const query = {
    ...paginate(pagination),
    ...sortBy(sort, sortFields),
  }
  if (ORDER_STATUSES.includes(status)) {
    query.status = status
  } else {
    return Promise.reject(new TypeError(`[listOrdersMethod] status must be one of '${ORDER_STATUSES.join(' / ')}' (${status})`))
  }
  return this._fetch({
    uri: '/marketplace/orders',
    query,
  })
}
