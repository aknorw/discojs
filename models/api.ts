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

export interface EmptyResponse {}

export interface IdentityResponse extends t.TypeOf<typeof IdentityIO> {}

export interface UserProfileResponse extends t.TypeOf<typeof UserIO> {}

export interface EditUserProfileResponse extends t.TypeOf<typeof UserIO> {}

export const UserSubmissionsResponseIO = t.type({
  pagination: PaginationIO,
  submissions: t.partial({
    artists: t.array(UserSubmissionArtistIO),
    labels: t.array(LabelIO),
    releases: t.array(ReleaseIO),
  }),
})
export interface UserSubmissionsResponse extends t.TypeOf<typeof UserSubmissionsResponseIO> {}

export const UserContributionsResponseIO = t.type({
  pagination: PaginationIO,
  contributions: t.array(ReleaseIO),
})
export interface UserContributionsResponse extends t.TypeOf<typeof UserContributionsResponseIO> {}

export const FoldersResponseIO = t.type({
  folders: t.array(FolderIO),
})
export interface FoldersResponse extends t.TypeOf<typeof FoldersResponseIO> {}

export const FolderReleasesResponseIO = t.type({
  pagination: PaginationIO,
  releases: t.array(
    t.type({
      id: t.Integer,
      instance_id: t.Integer,
      rating: t.Integer,
      date_added: t.string,
      basic_information: ReleaseMinimalInfoIO,
    }),
  ),
})
export interface FolderReleasesResponse extends t.TypeOf<typeof FolderReleasesResponseIO> {}

export const AddToFolderResponseIO = t.intersection([
  ResourceURLIO,
  t.type({
    instance_id: t.Integer,
  }),
])
export interface AddToFolderResponse extends t.TypeOf<typeof AddToFolderResponseIO> {}

export const CustomFieldsResponseIO = t.type({
  fields: t.array(CustomFieldIO),
})
export interface CustomFieldsResponse extends t.TypeOf<typeof CustomFieldsResponseIO> {}

export interface CollectionValueResponse extends t.TypeOf<typeof CollectionValueIO> {}

export const WantlistResponseIO = t.type({
  pagination: PaginationIO,
  wants: t.array(
    t.type({
      rating: t.number,
      basic_information: ReleaseBasicInfoIO,
    }),
  ),
})
export interface WantlistResponse extends t.TypeOf<typeof WantlistResponseIO> {}

export const AddToWantlistResponseIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    rating: t.number,
    notes: t.string,
    basic_information: ReleaseBasicInfoIO,
  }),
])
export interface AddToWantlistResponse extends t.TypeOf<typeof AddToWantlistResponseIO> {}

export const UserListsResponseIO = t.type({
  pagination: PaginationIO,
  lists: t.array(UserListIO),
})
export interface UserListsResponse extends t.TypeOf<typeof UserListsResponseIO> {}

export const UserListItemsResponseIO = t.type({
  items: t.array(UserListItemIO),
})
export interface UserListItemsResponse extends t.TypeOf<typeof UserListItemsResponseIO> {}

export const SearchResponseIO = t.type({
  pagination: PaginationIO,
  results: t.array(SearchEntityIO),
})
export interface SearchResponse extends t.TypeOf<typeof SearchResponseIO> {}

export const ArtistReleasesResponseIO = t.type({
  pagination: PaginationIO,
  releases: t.array(ArtistReleaseIO),
})
export interface ArtistReleasesResponse extends t.TypeOf<typeof ArtistReleasesResponseIO> {}

export const LabelReleasesResponseIO = t.type({
  pagination: PaginationIO,
  releases: t.array(LabelReleaseIO),
})
export interface LabelReleasesResponse extends t.TypeOf<typeof LabelReleasesResponseIO> {}

export const ReleaseRatingResponseIO = t.type({
  release_id: t.Integer,
  username: t.string,
  rating: t.Integer,
})
export interface ReleaseRatingResponse extends t.TypeOf<typeof ReleaseRatingResponseIO> {}

export const CommunityReleaseRatingResponseIO = t.type({
  release_id: t.Integer,
  rating: CommunityReleaseRatingIO,
})
export interface CommunityReleaseRatingResponse extends t.TypeOf<typeof CommunityReleaseRatingResponseIO> {}

export const MasterVersionsResponseIO = t.type({
  pagination: PaginationIO,
  versions: t.array(MasterVersionIO),
})
export interface MasterVersionsResponse extends t.TypeOf<typeof MasterVersionsResponseIO> {}

export const InventoryResponseIO = t.type({
  pagination: PaginationIO,
  listings: t.array(ListingIO),
})
export interface InventoryResponse extends t.TypeOf<typeof InventoryResponseIO> {}

export const CreateListingResponseIO = t.intersection([
  ResourceURLIO,
  t.type({
    listing_id: t.Integer,
  }),
])
export interface CreateListingResponse extends t.TypeOf<typeof CreateListingResponseIO> {}

export const OrdersResponseIO = t.type({
  pagination: PaginationIO,
  orders: t.array(OrderIO),
})
export interface OrdersResponse extends t.TypeOf<typeof OrdersResponseIO> {}

export const OrderMessagesResponseIO = t.type({
  pagination: PaginationIO,
  messages: t.array(OrderMessageIO),
})
export interface OrderMessagesResponse extends t.TypeOf<typeof OrderMessagesResponseIO> {}

export const PriceSuggestionsResponseIO = t.partial(
  Object.values(ReleaseConditionsEnum).reduce(
    (acc, condition) => ({
      ...acc,
      [condition]: ValueWithCurrencyIO,
    }),
    {} as Record<ReleaseConditionsEnum, typeof ValueWithCurrencyIO>,
  ),
)
export interface PriceSuggestionsResponse extends t.TypeOf<typeof PriceSuggestionsResponseIO> {}

export const MarketplaceStatisticsResponseIO = t.type({
  blocked_from_sale: t.boolean,
  lowest_price: t.union([ValueWithCurrencyIO, t.null]),
  num_for_sale: t.union([t.Integer, t.null]),
})
export interface MarketplaceStatisticsResponse extends t.TypeOf<typeof MarketplaceStatisticsResponseIO> {}
