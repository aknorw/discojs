export default function getOrder(orderId) {
  if (typeof orderId !== 'number') {
    return Promise.reject(new TypeError(`[getOrderMethod] orderId must be a number (${orderId})`))
  }
  return this._fetch({ uri: `/marketplace/orders/${orderId}` })
}
