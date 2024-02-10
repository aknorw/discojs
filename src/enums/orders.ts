export enum EditOrderStatusesEnum {
  NEW_ORDER = 'New Order',
  BUYER_CONTACTER = 'Buyer Contacted',
  INVOICE_SENT = 'Invoice Sent',
  PAYMENT_PENDING = 'Payment Pending',
  PAYMENT_RECEIVED = 'Payment Received',
  SHIPPED = 'Shipped',
  REFUND_SENT = 'Refund Sent',
  CANCELLED_NON_PAYING_BUYER = 'Cancelled (Non-Paying Buyer)',
  CANCELLED_ITEM_UNAVAILABLE = 'Cancelled (Item Unavailable)',
  CANCELLED_PER_BUYER_REQUEST = "Cancelled (Per Buyer's Request)",
}

export enum OrderStatusesEnum {
  ALL = 'All',
  NEW_ORDER = 'New Order',
  BUYER_CONTACTED = 'Buyer Contacted',
  INVOICE_SENT = 'Invoice Sent',
  PAYMENT_PENDING = 'Payment Pending',
  PAYMENT_RECEIVED = 'Payment Received',
  SHIPPED = 'Shipped',
  MERGED = 'Merged',
  ORDER_CHANGED = 'Order Changed',
  REFUND_SENT = 'Refund Sent',
  CANCELLED = 'Cancelled',
  CANCELLED_NON_PAYING_BUYER = 'Cancelled (Non-Paying Buyer)',
  CANCELLED_ITEM_UNAVAILABLE = 'Cancelled (Item Unavailable)',
  CANCELLED_PER_BUYER_REQUEST = "Cancelled (Per Buyer's Request)",
  CANCELLED_REFUND_RECEIVED = 'Cancelled (Refund Received)',
}

export enum OrderSortEnum {
  ID = 'id',
  BUYER = 'buyer',
  CREATED = 'created',
  STATUS = 'status',
  LAST_ACTIVITY = 'last_activity',
}

export enum OrderMessageTypesEnum {
  STATUS = 'status',
  MESSAGE = 'message',
  SHIPPING = 'shipping',
  REFUND_SENT = 'refund_sent',
  REFUND_RECEIVED = 'refund_received',
}
