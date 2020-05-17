import * as t from 'io-ts'

import { ImageIO, ResourceURLIO } from './commons'
import { makeEnumIOType } from './helpers'
import { DataQualityEnum } from '../src/constants'

const SubLabelIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    name: t.string,
  }),
])

export const LabelIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    name: t.string,
    profile: t.string,
    contact_info: t.string,
    data_quality: makeEnumIOType(DataQualityEnum),
    sublabels: t.array(SubLabelIO),
    urls: t.array(t.string),
    releases_url: t.string,
    images: t.array(ImageIO),
    uri: t.string,
  }),
])

export interface Label extends t.TypeOf<typeof LabelIO> {}