import * as t from 'io-ts'

import { SearchTypeEnum } from '../src/enums'
import { ResourceURLIO, StatBooleanIO } from './commons'
import { makeEnumIOType } from './helpers'

/**
 * @internal
 */
export const SearchEntityIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    type: makeEnumIOType(SearchTypeEnum),
    title: t.string,
    thumb: t.string,
    user_data: StatBooleanIO,
    cover_image: t.string,
    master_id: t.union([t.number, t.null]),
    master_url: t.union([t.string, t.null]),
    uri: t.string,
  }),
])
