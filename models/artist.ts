import * as t from 'io-ts'

import { ImageIO, ResourceURLIO } from './commons'
import { makeEnumIOType } from './helpers'
import { DataQualityEnum } from '../src/enums'

/**
 * @internal
 */
const MemberIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    name: t.string,
    active: t.boolean,
  }),
])

/**
 * @internal
 */
const ArtistBaseIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    profile: t.string,
    data_quality: makeEnumIOType(DataQualityEnum),
    namevariations: t.array(t.string),
    releases_url: t.string,
    images: t.array(ImageIO),
    uri: t.string,
  }),
  t.partial({
    urls: t.array(t.string),
  }),
])

/**
 * @internal
 */
export const ArtistIO = t.intersection([
  ArtistBaseIO,
  t.partial({
    members: t.array(MemberIO),
  }),
])

export type Artist = t.TypeOf<typeof ArtistIO>

/**
 * @internal
 */
export const UserSubmissionArtistIO = t.intersection([
  ArtistBaseIO,
  t.partial({
    members: t.union([t.readonlyArray(t.string), t.string]),
  }),
])
