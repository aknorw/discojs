import * as t from 'io-ts'

import { makeEnumIOType } from './helpers'
import { CurrenciesEnum } from '../src/constants'

/**
 * @internal
 */
export const PaginationIO = t.type({
  items: t.Integer,
  page: t.Integer,
  pages: t.Integer,
  per_page: t.Integer,
  urls: t.partial({
    first: t.union([t.string, t.undefined]),
    prev: t.union([t.string, t.undefined]),
    next: t.union([t.string, t.undefined]),
    last: t.union([t.string, t.undefined]),
  }),
})

/**
 * @internal
 */
export const ResourceURLIO = t.type({
  resource_url: t.string,
})

/**
 * @internal
 */
export const ImageIO = t.intersection([
  ResourceURLIO,
  t.type({
    type: t.union([t.literal('primary'), t.literal('secondary')]),
    width: t.Integer,
    height: t.Integer,
    uri: t.string,
    uri150: t.string,
  }),
])

/**
 * @internal
 */
export const VideoIO = t.type({
  title: t.string,
  description: t.string,
  duration: t.Integer,
  embed: t.boolean,
  uri: t.string,
})

/**
 * @internal
 */
export const ValueWithCurrencyIO = t.partial({
  value: t.number,
  currency: makeEnumIOType(CurrenciesEnum),
})

/**
 * @internal
 */
export const StatNumberIO = t.type({
  in_collection: t.number,
  in_wantlist: t.number,
})

/**
 * @internal
 */
export const StatBooleanIO = t.type({
  in_collection: t.boolean,
  in_wantlist: t.boolean,
})
