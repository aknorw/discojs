import * as t from 'io-ts'

import { ImageIO, ResourceURLIO, StatNumberIO, ValueWithCurrencyIO } from './commons'
import { makeEnumIOType } from './helpers'
import {
  CurrenciesEnum,
  EditOrderStatusesEnum,
  ListingStatusesEnum,
  OrderMessageTypesEnum,
  ReleaseConditionsEnum,
  SleeveConditionsEnum,
} from '../src/constants'

/**
 * @internal
 */
const ReleaseConditionsRuntimeEnum = makeEnumIOType(ReleaseConditionsEnum)

/**
 * @internal
 */
const SleeveConditionsRuntimeEnum = makeEnumIOType(SleeveConditionsEnum)

/**
 * @internal
 */
const EditOrderStatusesRuntimeEnum = makeEnumIOType(EditOrderStatusesEnum)

/**
 * @internal
 */
export const FeeIO = ValueWithCurrencyIO

/**
 * @internal
 */
const SellerIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    uid: t.Integer,
    username: t.string,
    avatar_url: t.string,
    payment: t.string,
    shipping: t.string,
    stats: t.type({
      rating: t.string,
      stars: t.number,
      total: t.Integer,
    }),
    url: t.string,
    html_url: t.string,
    is_mp2020_seller: t.boolean,
  }),
])

/**
 * @internal
 */
const OriginalPriceIO = t.partial({
  value: t.number,
  curr_id: t.Integer,
  curr_abbr: makeEnumIOType(CurrenciesEnum),
  formatted: t.string,
})

/**
 * @internal
 */
export const ListingIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    status: makeEnumIOType(ListingStatusesEnum),
    release: t.intersection([
      ResourceURLIO,
      t.type({
        id: t.Integer,
        title: t.string,
        artist: t.string,
        description: t.string,
        format: t.string,
        year: t.Integer,
        images: t.readonlyArray(ImageIO),
        catalog_number: t.string,
        thumbnail: t.string,
        stats: t.type({
          user: StatNumberIO,
          community: StatNumberIO,
        }),
      }),
    ]),
    seller: SellerIO,
    price: ValueWithCurrencyIO,
    original_price: t.intersection([
      OriginalPriceIO,
      t.partial({
        converted: OriginalPriceIO,
      }),
    ]),
    shipping_price: ValueWithCurrencyIO,
    original_shipping_price: t.intersection([
      OriginalPriceIO,
      t.partial({
        converted: OriginalPriceIO,
      }),
    ]),
    allow_offers: t.boolean,
    ships_from: t.string,
    posted: t.string,
    condition: ReleaseConditionsRuntimeEnum,
    sleeve_condition: SleeveConditionsRuntimeEnum,
    comments: t.string,
    audio: t.boolean,
    uri: t.string,
  }),
  t.partial({
    in_cart: t.boolean,
  }),
])

/**
 * @internal
 */
const OrderItemIO = t.type({
  id: t.Integer,
  release: t.type({
    id: t.Integer,
    description: t.string,
  }),
  price: ValueWithCurrencyIO,
  media_condition: ReleaseConditionsRuntimeEnum,
  sleeve_condition: SleeveConditionsRuntimeEnum,
})

/**
 * @internal
 */
export const OrderIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.string,
    status: EditOrderStatusesRuntimeEnum,
    next_status: t.array(EditOrderStatusesRuntimeEnum),
    items: t.array(OrderItemIO),
    shipping: t.intersection([
      ValueWithCurrencyIO,
      t.type({
        method: t.string,
      }),
    ]),
    shipping_address: t.string,
    additional_instructions: t.string,
    fee: FeeIO,
    total: ValueWithCurrencyIO,
    seller: t.intersection([
      ResourceURLIO,
      t.type({
        id: t.Integer,
        username: t.string,
      }),
    ]),
    buyer: t.intersection([
      ResourceURLIO,
      t.type({
        id: t.Integer,
        username: t.string,
      }),
    ]),
    archived: t.boolean,
    created: t.string,
    last_activity: t.string,
    messages_url: t.string,
    uri: t.string,
  }),
])

/**
 * @internal
 */
const OrderMessageStatusIO = t.type({
  // type: t.literal(OrderMessageTypesEnum.STATUS),
  status_id: t.Integer,
  actor: t.intersection([
    ResourceURLIO,
    t.type({
      username: t.string,
    }),
  ]),
})

/**
 * @internal
 */
const OrderMessageMessageIO = t.type({
  // type: t.literal(OrderMessageTypesEnum.MESSAGE),
  from: t.intersection([
    ResourceURLIO,
    t.type({
      id: t.Integer,
      username: t.string,
      avatar_url: t.string,
    }),
  ]),
})

/**
 * @internal
 */
const OrderMessageShippingIO = t.type({
  // type: t.literal(OrderMessageTypesEnum.SHIPPING),
  original: t.number,
  new: t.number,
})

/**
 * @internal
 */
const OrderMessageRefundIO = t.type({
  // type: t.union([t.literal(OrderMessageTypesEnum.REFUND_SENT), t.literal(OrderMessageTypesEnum.REFUND_RECEIVED)]),
  refund: t.type({
    amount: t.number,
    order: t.intersection([
      ResourceURLIO,
      t.type({
        id: t.Integer,
      }),
    ]),
  }),
})

/**
 * @internal
 */
export const OrderMessageIO = t.intersection([
  t.type({
    type: makeEnumIOType(OrderMessageTypesEnum),
    subject: t.string,
    message: t.string,
    timestamp: t.string,
    order: t.intersection([
      ResourceURLIO,
      t.type({
        id: t.Integer,
      }),
    ]),
  }),
  OrderMessageStatusIO,
  OrderMessageMessageIO,
  OrderMessageShippingIO,
  OrderMessageRefundIO,
])

export type Fee = t.TypeOf<typeof FeeIO>
export type Listing = t.TypeOf<typeof ListingIO>
export type Order = t.TypeOf<typeof OrderIO>
export type OrderMessage = t.TypeOf<typeof OrderMessageIO>
