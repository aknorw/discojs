import * as t from 'io-ts'

import { ImageIO, ResourceURLIO } from './commons'
import { makeEnumIOType } from './helpers'
import { DataQualityEnum } from '../src/enums'

/**
 * @internal
 */
const SubLabelIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    name: t.string,
  }),
])

/**
 * @internal
 */
export const LabelIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    name: t.string,
    data_quality: makeEnumIOType(DataQualityEnum),
    releases_url: t.string,
    uri: t.string,
  }),
  t.partial({
    profile: t.string,
    contact_info: t.string,
    sublabels: t.array(SubLabelIO),
    urls: t.array(t.string),
    images: t.array(ImageIO),
  }),
])

export type Label = t.TypeOf<typeof LabelIO>
