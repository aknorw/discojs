export default function listMessagesForOrder(orderId) {
  if (typeof orderId !== 'number') {
    return Promise.reject(new TypeError(`[listMessagesForOrderMethod] orderId must be a number (${orderId})`))
  }
  return this._fetch({ uri: `/marketplace/orders/${orderId}/messages` })
}
