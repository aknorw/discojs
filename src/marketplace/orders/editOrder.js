import { EDIT_STATUSES } from '../../constants'

export default function editOrder(orderId, { status, shipping } = {}) {
  if (typeof orderId !== 'number') {
    return Promise.reject(new TypeError(`[editOrderMethod] orderId must be a number (${orderId})`))
  }
  const data = {}
  if (status) {
    if (EDIT_STATUSES.includes(status)) {
      data.status = status
    } else {
      return Promise.reject(
        new TypeError(`[editOrderMethod] status must be one of '${EDIT_STATUSES.join(' / ')}' (${status})`),
      )
    }
  }
  if (shipping) {
    if (typeof shipping === 'number') {
      data.shipping = shipping
    } else {
      return Promise.reject(new TypeError(`[editOrderMethod] shipping must be a string (${shipping})`))
    }
  }
  if (Object.keys(data).length === 0) {
    return Promise.reject(new Error('[editOrderMethod] status or shipping must be provided'))
  }
  return this._fetch({
    uri: `/marketplace/orders/${orderId}`,
    options: {
      method: 'POST',
      data,
    },
  })
}
