import * as t from 'io-ts'

import { ImageIO, ResourceURLIO, StatNumberIO, VideoIO } from './commons'
import { makeEnumIOType } from './helpers'
import { CommunityStatusesEnum, DataQualityEnum } from '../src/enums'

/**
 * @internal
 */
const CommunityStatusesRuntimeEnum = makeEnumIOType(CommunityStatusesEnum)

/**
 * @internal
 */
const DataQualityRuntimeEnum = makeEnumIOType(DataQualityEnum)

/**
 * @internal
 */
const ContributorIO = t.intersection([
  ResourceURLIO,
  t.type({
    username: t.string,
  }),
])

/**
 * @internal
 */
export const CommunityReleaseRatingIO = t.type({
  count: t.Integer,
  average: t.number,
})

/**
 * @internal
 */
export const ReleaseArtistIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    name: t.string,
    anv: t.string,
    join: t.string,
    role: t.string,
    tracks: t.string,
  }),
])

/**
 * @internal
 */
const ReleaseFormatIO = t.type({
  name: t.string,
  qty: t.string,
})

/**
 * @internal
 */
const ReleaseEntityIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    name: t.string,
    entity_type: t.string,
    entity_type_name: t.string,
    catno: t.string,
  }),
])

/**
 * @internal
 */
const ReleaseIdentifierIO = t.type({
  type: t.string,
  value: t.string,
})

/**
 * @internal
 */
export const TrackIO = t.type({
  type_: t.string,
  title: t.string,
  position: t.string,
  duration: t.string,
})

/**
 * @internal
 */
export const ReleaseBasicInfoIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    title: t.string,
    artists: t.array(ReleaseArtistIO),
    formats: t.array(ReleaseFormatIO),
    labels: t.array(ReleaseEntityIO),
    year: t.Integer,
    cover_image: t.string,
    thumb: t.string,
  }),
])

/**
 * @internal
 */
export const ReleaseMinimalInfoIO = t.intersection([
  ReleaseBasicInfoIO,
  t.type({
    genres: t.array(t.string),
    styles: t.array(t.string),
    master_id: t.number,
    master_url: t.string,
  }),
])

/**
 * @internal
 */
export const ReleaseIO = t.intersection([
  ResourceURLIO,
  t.partial({
    extraartists: t.array(ReleaseArtistIO),
    genres: t.array(t.string),
    styles: t.array(t.string),
    country: t.string,
    notes: t.string,
    released: t.string,
    released_formatted: t.string,
    tracklist: t.array(TrackIO),
    master_id: t.Integer,
    master_url: t.string,
    estimated_weight: t.number,
    images: t.array(ImageIO),
    videos: t.array(VideoIO),
  }),
  t.type({
    id: t.Integer,
    title: t.string,
    artists: t.array(ReleaseArtistIO),
    formats: t.array(ReleaseFormatIO),
    year: t.Integer,
    format_quantity: t.Integer,
    identifiers: t.array(ReleaseIdentifierIO),
    labels: t.array(ReleaseEntityIO),
    companies: t.array(ReleaseEntityIO),
    series: t.array(ReleaseEntityIO),
    thumb: t.string,
    lowest_price: t.union([t.number, t.null]),
    num_for_sale: t.Integer,
    date_added: t.string,
    date_changed: t.string,
    data_quality: DataQualityRuntimeEnum,
    status: CommunityStatusesRuntimeEnum,
    community: t.type({
      have: t.Integer,
      want: t.Integer,
      rating: CommunityReleaseRatingIO,
      submitter: ContributorIO,
      contributors: t.array(ContributorIO),
      data_quality: DataQualityRuntimeEnum,
      status: CommunityStatusesRuntimeEnum,
    }),
    uri: t.string,
  }),
])

export type Release = t.TypeOf<typeof ReleaseIO>

/**
 * @internal
 */
export const ArtistReleaseIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    title: t.string,
    artist: t.string,
    year: t.number,
    stats: t.type({
      user: StatNumberIO,
      community: StatNumberIO,
    }),
    thumb: t.string,
  }),
])

/**
 * @internal
 */
export const LabelReleaseIO = t.intersection([
  ArtistReleaseIO,
  t.type({
    format: t.string,
    catno: t.string,
    status: CommunityStatusesRuntimeEnum,
  }),
])
