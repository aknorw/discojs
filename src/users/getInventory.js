import paginate from '../utils/paginate'
import sortBy from '../utils/sort'

const statusFields = [
  'All',
  'Deleted',
  'Draft',
  'Expired',
  'For Sale',
  'Sold',
  'Suspended',
  'Violation',
]

export const sortFields = [
  'listed',
  'price',
  'item',
  'artist',
  'label',
  'catno',
  'audio',
  'status',
  'location',
]

export default function getInventory({
  username,
  status,
  pagination,
  sort,
} = {}) {
  if (typeof username !== 'string') {
    return Promise.reject(new TypeError(`[getInventoryMethod] username must be a string (${username})`))
  }
  const q = {}
  if (statusFields.includes(status)) {
    q.status = status
  }
  return this._fetch({
    uri: `/users/${username}/inventory`,
    query: {
      ...q,
      ...sortBy(sort, sortFields),
      ...paginate(pagination),
    },
  })
}
