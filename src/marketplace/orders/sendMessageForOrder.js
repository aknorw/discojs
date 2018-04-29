import { ORDER_STATUSES } from '../../constants'

export default function sendMessageForOrder(orderId, { message, status } = {}) {
  if (typeof orderId !== 'number') {
    return Promise.reject(new TypeError(`[sendMessageForOrderMethod] orderId must be a number (${orderId})`))
  }
  const data = {}
  if (!message && !status) {
    return Promise.reject(new Error('[sendMessageForOrderMethod] message or status must be present'))
  }
  if (message) {
    if (typeof message === 'string') {
      data.message = message
    } else {
      return Promise.reject(new TypeError(`[sendMessageForOrderMethod] message must be a string (${message})`))
    }
  }
  if (status) {
    if (ORDER_STATUSES.includes(status)) {
      data.status = status
    } else {
      return Promise.reject(new TypeError(`[sendMessageForOrderMethod] status must be one of '${ORDER_STATUSES.join(' / ')}' (${status})`))
    }
  }
  return this._fetch({
    uri: `/marketplace/orders/${orderId}/messages`,
    options: {
      method: 'POST',
      data,
    },
  })
}
