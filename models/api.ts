import * as t from 'io-ts'

import { UserSubmissionArtistIO } from './artist'
import { PaginationIO, ResourceURLIO, ValueWithCurrencyIO } from './commons'
import { CollectionValueIO, CustomFieldIO, FolderIO } from './folder'
import { LabelIO } from './label'
import { ListingIO, OrderIO, OrderMessageIO } from './marketplace'
import { MasterVersionIO } from './master'
import {
  ArtistReleaseIO,
  CommunityReleaseRatingIO,
  LabelReleaseIO,
  ReleaseBasicInfoIO,
  ReleaseMinimalInfoIO,
  ReleaseIO,
} from './release'
import { SearchEntityIO } from './search'
import { IdentityIO, UserIO, UserListIO, UserListItemIO } from './user'
import { ReleaseConditionsEnum } from '../src/constants'

export type EmptyResponse = {}

export const ErrorResponseIO = t.intersection([
  t.type({
    message: t.string,
  }),
  t.partial({
    detail: t.array(
      t.type({
        loc: t.array(t.string),
        msg: t.string,
        type: t.string,
      }),
    ),
  }),
])

export type ErrorResponse = t.TypeOf<typeof ErrorResponseIO>

export type Pagination = t.TypeOf<typeof PaginationIO>

export interface IPaginated {
  pagination: Pagination
}

export type IdentityResponse = t.TypeOf<typeof IdentityIO>

export type UserProfileResponse = t.TypeOf<typeof UserIO>

export type EditUserProfileResponse = t.TypeOf<typeof UserIO>

/**
 * @internal
 */
export const UserSubmissionsResponseIO = t.type({
  pagination: PaginationIO,
  submissions: t.partial({
    artists: t.array(UserSubmissionArtistIO),
    labels: t.array(LabelIO),
    releases: t.array(ReleaseIO),
  }),
})
export type UserSubmissionsResponse = t.TypeOf<typeof UserSubmissionsResponseIO>

/**
 * @internal
 */
export const UserContributionsResponseIO = t.type({
  pagination: PaginationIO,
  contributions: t.array(ReleaseIO),
})
export type UserContributionsResponse = t.TypeOf<typeof UserContributionsResponseIO>

/**
 * @internal
 */
export const FoldersResponseIO = t.type({
  folders: t.array(FolderIO),
})
export type FoldersResponse = t.TypeOf<typeof FoldersResponseIO>

export const FieldIO = t.type({
  field_id: t.Integer,
  value: t.string,
})

export type Field = t.TypeOf<typeof FieldIO>

/**
 * @internal
 */
export const FolderReleasesResponseIO = t.type({
  pagination: PaginationIO,
  releases: t.array(
    t.type({
      id: t.Integer,
      instance_id: t.Integer,
      rating: t.Integer,
      date_added: t.string,
      basic_information: ReleaseMinimalInfoIO,
      folder_id: t.Integer,
      notes: t.array(FieldIO),
    }),
  ),
})
export type FolderReleasesResponse = t.TypeOf<typeof FolderReleasesResponseIO>

/**
 * @internal
 */
export const AddToFolderResponseIO = t.intersection([
  ResourceURLIO,
  t.type({
    instance_id: t.Integer,
  }),
])
export type AddToFolderResponse = t.TypeOf<typeof AddToFolderResponseIO>

/**
 * @internal
 */
export const CustomFieldsResponseIO = t.type({
  fields: t.array(CustomFieldIO),
})
export type CustomFieldsResponse = t.TypeOf<typeof CustomFieldsResponseIO>

export type CollectionValueResponse = t.TypeOf<typeof CollectionValueIO>

/**
 * @internal
 */
export const WantlistResponseIO = t.type({
  pagination: PaginationIO,
  wants: t.array(
    t.type({
      rating: t.number,
      basic_information: ReleaseBasicInfoIO,
    }),
  ),
})
export type WantlistResponse = t.TypeOf<typeof WantlistResponseIO>

/**
 * @internal
 */
export const AddToWantlistResponseIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    rating: t.number,
    notes: t.string,
    basic_information: ReleaseBasicInfoIO,
  }),
])
export type AddToWantlistResponse = t.TypeOf<typeof AddToWantlistResponseIO>

/**
 * @internal
 */
export const UserListsResponseIO = t.type({
  pagination: PaginationIO,
  lists: t.array(UserListIO),
})
export type UserListsResponse = t.TypeOf<typeof UserListsResponseIO>

/**
 * @internal
 */
export const UserListItemsResponseIO = t.type({
  items: t.array(UserListItemIO),
})
export type UserListItemsResponse = t.TypeOf<typeof UserListItemsResponseIO>

/**
 * @internal
 */
export const SearchResponseIO = t.type({
  pagination: PaginationIO,
  results: t.array(SearchEntityIO),
})
export type SearchResponse = t.TypeOf<typeof SearchResponseIO>

/**
 * @internal
 */
export const ArtistReleasesResponseIO = t.type({
  pagination: PaginationIO,
  releases: t.array(ArtistReleaseIO),
})
export type ArtistReleasesResponse = t.TypeOf<typeof ArtistReleasesResponseIO>

/**
 * @internal
 */
export const LabelReleasesResponseIO = t.type({
  pagination: PaginationIO,
  releases: t.array(LabelReleaseIO),
})
export type LabelReleasesResponse = t.TypeOf<typeof LabelReleasesResponseIO>

/**
 * @internal
 */
export const ReleaseRatingResponseIO = t.type({
  release_id: t.Integer,
  username: t.string,
  rating: t.Integer,
})
export type ReleaseRatingResponse = t.TypeOf<typeof ReleaseRatingResponseIO>

/**
 * @internal
 */
export const CommunityReleaseRatingResponseIO = t.type({
  release_id: t.Integer,
  rating: CommunityReleaseRatingIO,
})
export type CommunityReleaseRatingResponse = t.TypeOf<typeof CommunityReleaseRatingResponseIO>

/**
 * @internal
 */
export const MasterVersionsResponseIO = t.type({
  pagination: PaginationIO,
  versions: t.array(MasterVersionIO),
})
export type MasterVersionsResponse = t.TypeOf<typeof MasterVersionsResponseIO>

/**
 * @internal
 */
export const InventoryResponseIO = t.type({
  pagination: PaginationIO,
  listings: t.array(ListingIO),
})
export type InventoryResponse = t.TypeOf<typeof InventoryResponseIO>

/**
 * @internal
 */
export const CreateListingResponseIO = t.intersection([
  ResourceURLIO,
  t.type({
    listing_id: t.Integer,
  }),
])
export type CreateListingResponse = t.TypeOf<typeof CreateListingResponseIO>

/**
 * @internal
 */
export const OrdersResponseIO = t.type({
  pagination: PaginationIO,
  orders: t.array(OrderIO),
})
export interface OrdersResponse extends t.TypeOf<typeof OrdersResponseIO> {}

/**
 * @internal
 */
export const OrderMessagesResponseIO = t.type({
  pagination: PaginationIO,
  messages: t.array(OrderMessageIO),
})
export type OrderMessagesResponse = t.TypeOf<typeof OrderMessagesResponseIO>

/**
 * @internal
 */
export const PriceSuggestionsResponseIO = t.partial(
  Object.values(ReleaseConditionsEnum).reduce(
    (acc, condition) => ({
      ...acc,
      [condition]: ValueWithCurrencyIO,
    }),
    {} as Record<ReleaseConditionsEnum, typeof ValueWithCurrencyIO>,
  ),
)
export type PriceSuggestionsResponse = t.TypeOf<typeof PriceSuggestionsResponseIO>

/**
 * @internal
 */
export const MarketplaceStatisticsResponseIO = t.type({
  blocked_from_sale: t.boolean,
  lowest_price: t.union([ValueWithCurrencyIO, t.null]),
  num_for_sale: t.union([t.Integer, t.null]),
})
export type MarketplaceStatisticsResponse = t.TypeOf<typeof MarketplaceStatisticsResponseIO>
