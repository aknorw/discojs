import * as t from 'io-ts'

import { CommunityStatusesEnum, DataQualityEnum } from '../src/enums'
import { ImageIO, ResourceURLIO, StatNumberIO, VideoIO } from './commons'
import { makeEnumIOType } from './helpers'
import { ReleaseArtistIO, TrackIO } from './release'

/**
 * @internal
 */
export const MasterIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    main_release: t.Integer,
    main_release_url: t.string,
    versions_url: t.string,
    title: t.string,
    artists: t.array(ReleaseArtistIO),
    genres: t.array(t.string),
    styles: t.array(t.string),
    year: t.Integer,
    tracklist: t.array(TrackIO),
    lowest_price: t.number,
    num_for_sale: t.Integer,
    data_quality: makeEnumIOType(DataQualityEnum),
    images: t.array(ImageIO),
    uri: t.string,
  }),
  t.partial({
    videos: t.array(VideoIO),
    notes: t.string,
  }),
])

export type Master = t.TypeOf<typeof MasterIO>

/**
 * @internal
 */
export const MasterVersionIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    title: t.string,
    format: t.string,
    major_formats: t.array(t.string),
    label: t.string,
    catno: t.string,
    released: t.string,
    country: t.string,
    status: makeEnumIOType(CommunityStatusesEnum),
    stats: t.type({
      user: StatNumberIO,
      community: StatNumberIO,
    }),
    thumb: t.string,
  }),
])
