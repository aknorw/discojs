import {
  CurrenciesEnum,
  EditOrderStatusesEnum,
  ListingStatusesEnum,
  ReleaseConditionsEnum,
  SearchTypeEnum,
  SleeveConditionsEnum,
} from './constants'

import { Range } from './utils'

/**
 * Types.
 */

// @TODO
export enum DataQualityEnum {
  NEEDS_VOTE = 'Needs Vote',
  CORRECT = 'Correct',
}

// @TODO
export enum CommunityStatusesEnum {
  ACCEPTED = 'Accepted',
}

/**
 * Resources used within Discogs responses.
 */

type WithResourceURL = {
  resource_url: string
}

type Image = WithResourceURL & {
  type: 'primary' | 'secondary'
  width: number
  height: number
  uri: string
  uri150: string
}

type Video = {
  title: string
  description: string
  duration: number
  embed: boolean
  uri: string
}

type Pagination = {
  items: number
  page: number
  pages: number
  per_page: number
  urls: {
    first: string
    prev: string
    next: string
    last: string
  }
}

type Member = WithResourceURL & {
  id: number
  name: string
  active: boolean
}

export type Artist = WithResourceURL & {
  id: number
  profile: string
  data_quality: DataQualityEnum
  namevariations: Array<string>
  members: Array<Member>
  urls: Array<string>
  images: Array<Image>
  uri: string
  releases_url: string
}

type SubLabel = WithResourceURL & {
  id: number
  name: string
}

export type Label = WithResourceURL & {
  id: number
  name: string
  profile: string
  contact_info: string
  data_quality: DataQualityEnum
  sublabels: Array<SubLabel>
  urls: Array<string>
  images: Array<Image>
  uri: string
  releases_url: string
}

type Contributor = WithResourceURL & {
  username: string
}

type CommunityReleaseRating = {
  count: number
  average: number
}

type ReleaseArtist = WithResourceURL & {
  id: number
  name: string
  anv: string
  join: string
  role: string
  tracks: string
}

type ReleaseFormat = {
  name: string
  qty: string
  descriptions: Array<string>
}

type ReleaseEntity = WithResourceURL & {
  id: number
  name: string
  entity_type: string
  entity_type_name?: string
  catno: string
}

type ReleaseIdentifier = {
  type: string
  value: string
}

type Track = {
  type_: string
  title: string
  position: string
  duration: string
}

export type Release = WithResourceURL & {
  id: number
  title: string
  artists: Array<ReleaseArtist>
  extraartists: Array<ReleaseArtist>
  genres: Array<string>
  styles: Array<string>
  formats: Array<ReleaseFormat>
  country: string
  year: number
  released: string
  released_formatted: string
  master_id: number
  master_url: string
  notes: string
  format_quantity: number
  identifiers: Array<ReleaseIdentifier>
  labels: Array<ReleaseEntity>
  companies: Array<ReleaseEntity>
  series: Array<ReleaseEntity>
  tracklist: Array<Track>
  thumb: string
  estimated_weight: number
  lowest_price: number
  num_for_sale: number
  date_added: string
  date_changed: string
  data_quality: DataQualityEnum
  status: CommunityStatusesEnum
  community: {
    status: CommunityStatusesEnum
    have: number
    want: number
    rating: CommunityReleaseRating
    submitter: Contributor
    contributors: Array<Contributor>
    data_quality: DataQualityEnum
  }
  images: Array<Image>
  videos: Array<Video>
  uri: string
}

export type Folder = WithResourceURL & {
  id: number
  count: number
  name: string
}

type CustomFieldDropdown = {
  type: 'boolean'
  options: Array<string>
}

type CustomFieldTextArea = {
  type: 'textarea'
  lines: number
}

type CustomField = {
  id: number
  name: string
  position: number
  public: boolean
  type: 'dropdown' | 'textarea'
} & CustomFieldDropdown &
  CustomFieldTextArea

type ReleaseBasicInfo = WithResourceURL & {
  id: number
  title: string
  artists: Array<ReleaseArtist>
  formats: Array<ReleaseFormat>
  labels: Array<ReleaseEntity>
  year: number
  cover_image: string
  thumb: string
}

export type Master = WithResourceURL & {
  id: number
  main_release: number
  main_release_url: string
  versions_url: string
  title: string
  artists: Array<ReleaseArtist>
  genres: Array<string>
  styles: Array<string>
  year: number
  tracklist: Array<Track>
  lowest_price: number
  num_for_sale: number
  data_quality: DataQualityEnum
  images: Array<Image>
  videos: Array<Video>
  uri: string
}

type UserList = WithResourceURL & {
  id: number
  name: string
  description: string
  public: boolean
  date_added: string
  date_changed: string
  uri: string
}

type UserListItem = WithResourceURL & {
  id: number
  type: SearchTypeEnum
  display_title: string
  comment: string
  uri: string
  image_url: string
}

type ValueWithCurrency = {
  value: number
  currency: CurrenciesEnum
}

export type Fee = ValueWithCurrency

type Seller = WithResourceURL & {
  id: number
  username: string
  avatar_url: string
  payment: string
  shipping: string
  stats: {
    rating: string
    stars: number
    total: number
  }
  url: string
}

type OriginalPrice = {
  value: number
  curr_id: number
  curr_abbr: CurrenciesEnum
  formatted: string
}

export type Listing = WithResourceURL & {
  id: number
  status: ListingStatusesEnum
  release: WithResourceURL & {
    id: number
    description: string
    year: number
    catalog_number: string
    thumbnail: string
  }
  seller: Seller
  price: ValueWithCurrency
  original_price: OriginalPrice
  shipping_price: ValueWithCurrency
  original_shipping_price: OriginalPrice
  allow_offers: boolean
  ships_from: string
  posted: string
  condition: ReleaseConditionsEnum
  sleeve_condition: SleeveConditionsEnum
  comments: string
  audio: boolean
  uri: string
}

type OrderItem = {
  id: number
  release: {
    id: number
    description: string
  }
  price: ValueWithCurrency
  media_condition: ReleaseConditionsEnum
  sleeve_condition: SleeveConditionsEnum
}

export type Order = WithResourceURL & {
  id: string
  status: EditOrderStatusesEnum
  next_status: Array<EditOrderStatusesEnum>
  items: Array<OrderItem>
  shipping: {
    value: number
    currency: CurrenciesEnum
    method: string
  }
  shipping_address: string
  additional_instructions: string
  fee: Fee
  total: ValueWithCurrency
  seller: WithResourceURL & {
    id: number
    username: string
  }
  buyer: WithResourceURL & {
    id: number
    username: string
  }
  archived: boolean
  created: string
  last_activity: string
  uri: string
  messages_url: string
}

export enum OrderMessageTypesEnum {
  STATUS = 'status',
  MESSAGE = 'message',
  SHIPPING = 'shipping',
  REFUND_SENT = 'refund_sent',
  REFUND_RECEIVED = 'refund_received',
}

type OrderMessageStatus = {
  type: OrderMessageTypesEnum.STATUS
  status_id: 6
  actor: WithResourceURL & {
    username: string
  }
}

type OrderMessageMessage = {
  type: OrderMessageTypesEnum.MESSAGE
  from: WithResourceURL & {
    id: number
    username: string
    avatar_url: string
  }
}

type OrderMessageShipping = {
  type: OrderMessageTypesEnum.SHIPPING
  original: number
  new: number
}

type OrderMessageRefund = {
  amount: number
  order: WithResourceURL & {
    id: string
  }
}

type OrderMessageRefundSent = {
  type: OrderMessageTypesEnum.REFUND_SENT
  refund: OrderMessageRefund
}

type OrderMessageRefundReceived = {
  type: OrderMessageTypesEnum.REFUND_RECEIVED
  refund: OrderMessageRefund
}

export type OrderMessage = {
  type: OrderMessageTypesEnum
  subject: string
  message: string
  timestamp: string
  order: WithResourceURL & {
    id: string
  }
} & OrderMessageStatus &
  OrderMessageMessage &
  OrderMessageShipping &
  OrderMessageRefundSent &
  OrderMessageRefundReceived

/**
 * Responses from Discogs API.
 */

export type EmptyResponse = {}

export type IdentityResponse = {
  id: number
  username: string
  resource_url: string
  consumer_name?: string
}

export type UserResponse = WithResourceURL & {
  id: number
  username: string
  name: string
  email?: string
  profile: string
  home_page: string
  location: string
  registered: string
  rank: number
  uri: string
  avatar_url: string
  banner_url: string
  collection_fields_url: string
  collection_folders_url: string
  inventory_url: string
  wantlist_url: string
  rating_avg: number
  releases_contributed: number
  releases_rated: number
  num_collection?: number
  num_for_sale: number
  num_lists: number
  num_pending: number
  num_wantlist?: number
  buyer_rating: number
  buyer_rating_stars: number
  buyer_num_ratings: number
  seller_rating: number
  seller_rating_stars: number
  seller_num_ratings: number
  curr_abbr: CurrenciesEnum
}

export type EditProfileResponse = WithResourceURL & {
  id: number
  username: string
  name: string
  email: string
  profile: string
  home_page: string
  location: string
  registered: string
  rank: number
  uri: string
  collection_fields_url: string
  collection_folders_url: string
  inventory_url: string
  wantlist_url: string
  rating_avg: number
  releases_contributed: number
  releases_rated: number
  num_collection?: number
  num_for_sale: number
  num_lists: number
  num_pending: number
  num_wantlist?: number
}

export type UserSubmissionsResponse = {
  pagination: Pagination
  submissions: {
    artists?: Array<Artist>
    labels?: Array<Label>
    releases?: Array<Release>
  }
}

export type UserContributionsResponse = {
  pagination: Pagination
  contributions: {
    artists?: Array<Artist>
    labels?: Array<Label>
    releases?: Array<Release>
  }
}

export type FoldersResponse = {
  folders: Array<Folder>
}

export type FolderReleasesResponse = {
  pagination: Pagination
  releases: Array<{
    id: number
    instance_id: number
    folder_id: number
    rating: Range<0, 6>
    date_added: string
    basic_information: ReleaseBasicInfo
  }>
}

export type ReleasesResponse = {
  pagination: Pagination
  releases: Array<Release>
}

export type AddToFolderResponse = WithResourceURL & {
  instance_id: number
}

export type CustomFieldsResponse = {
  fields: Array<CustomField>
}

export type CollectionValueResponse = {
  maximum: string
  median: string
  minimum: string
}

export type WantlistResponse = {
  pagination: Pagination
  wants: Array<{
    rating: number
    basic_information: ReleaseBasicInfo
  }>
}

export type AddToWantlistResponse = WithResourceURL & {
  id: number
  rating: number
  notes: string
  basic_information: ReleaseBasicInfo
}

export type UserListsResponse = {
  pagination: Pagination
  lists: Array<UserList>
}

export type UserListItemsResponse = {
  list_id: number
  name: string
  url: string
  created_ts: string
  modified_ts: string
  items: Array<UserListItem>
}

export type SearchResponse = {
  pagination: Pagination
  results: Array<Artist | Label | Master | Release>
}

export type ReleaseRatingResponse = {
  release: number
  username: string
  rating: Range<0, 6>
}

export type CommunityReleaseRatingResponse = {
  release_id: number
  rating: CommunityReleaseRating
}

export type MasterVersionsResponse = {
  pagination: Pagination
  versions: Array<Release>
}

export type InventoryResponse = {
  pagination: Pagination
  listings: Array<Partial<Listing>>
}

export type CreateListingResponse = WithResourceURL & {
  listing_id: number
}

export type OrdersResponse = {
  pagination: Pagination
  orders: Array<Order>
}

export type OrderMessagesResponse = {
  pagination: Pagination
  messages: Array<OrderMessage>
}

export type PriceSuggestionsResponse = Partial<
  {
    [key in ReleaseConditionsEnum]: ValueWithCurrency
  }
>

export type MarketplaceStatisticsResponse = {
  blocked_from_sale: boolean
  lowest_price: ValueWithCurrency | null
  num_for_sale: number | null
}
