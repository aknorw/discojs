import Bottleneck from 'bottleneck'
import { Headers } from 'cross-fetch'
import { stringify } from 'querystring'

import {
  CurrenciesEnum,
  EditOrderStatusesEnum,
  FolderIdsEnum,
  InventorySortEnum,
  InventoryStatusesEnum,
  ListingStatusesEnum,
  OrderSortEnum,
  OrderStatusesEnum,
  OutputFormatsEnum,
  ReleaseConditionsEnum,
  ReleaseSortEnum,
  SearchTypeEnum,
  SleeveConditionsEnum,
  UserSortEnum,
} from './constants'

import {
  AddToFolderResponse,
  AddToWantlistResponse,
  Artist,
  CollectionValueResponse,
  CommunityReleaseRatingResponse,
  CreateListingResponse,
  CustomFieldsResponse,
  EditProfileResponse,
  EmptyResponse,
  Fee,
  Folder,
  FolderReleasesResponse,
  FoldersResponse,
  IdentityResponse,
  InventoryResponse,
  Label,
  Listing,
  MarketplaceStatisticsResponse,
  Master,
  MasterVersionsResponse,
  Order,
  OrderMessage,
  OrderMessagesResponse,
  OrdersResponse,
  PriceSuggestionsResponse,
  Release,
  ReleaseRatingResponse,
  ReleasesResponse,
  SearchResponse,
  UserContributionsResponse,
  UserListItemsResponse,
  UserListsResponse,
  UserResponse,
  UserSubmissionsResponse,
  WantlistResponse,
} from './discogsTypes'

import {
  createLimiter,
  fetch,
  HTTPVerbsEnum,
  paginate,
  Pagination,
  Range,
  sortBy,
  SortOptions,
  transformData,
} from './utils'

/**
 * Constants.
 */

const BASE_URL = 'https://api.discogs.com'
const API_VERSION = 'v2'
const DEFAULT_USER_AGENT = `Discojs/__packageVersion__`

/**
 * Types.
 */

interface UserTokenAuth {
  userToken: string
}

interface ConsumerKeyAuth {
  consumerKey: string
  consumerSecret: string
}

interface LimiterOptions {
  requestLimit?: number
  requestLimitAuth?: number
  requestLimitInterval?: number
}

interface DiscojsOptions extends Partial<UserTokenAuth>, Partial<ConsumerKeyAuth>, LimiterOptions {
  userAgent?: string
  outputFormat?: OutputFormatsEnum
  fetchOptions?: RequestInit
}

type SearchOptions = {
  query?: string
  type?: SearchTypeEnum
  title?: string
  releaseTitle?: string
  credit?: string
  artist?: string
  anv?: string
  label?: string
  genre?: string
  style?: string
  country?: string
  year?: string | number
  format?: string
  catno?: string
  barcode?: string
  track?: string
  submitter?: string
  contributor?: string
}

type ProfileOptions = {
  username?: string
  name?: string
  homePage?: string
  location?: string
  profile?: string
  currAbbr?: CurrenciesEnum
}

type ListingOptions = {
  releaseId: number
  condition: ReleaseConditionsEnum
  sleeveCondition?: SleeveConditionsEnum
  price: number
  comments?: string
  allowOffers?: boolean
  status: ListingStatusesEnum
  externalId?: string
  location?: string
  weight?: 'auto' | number
  formatQuantity?: 'auto' | number
}

/**
 * Type guards.
 */

function isAuthenticatedWithToken(options?: Partial<UserTokenAuth>): options is UserTokenAuth {
  return Boolean(options) && typeof options!.userToken === 'string'
}

function isAuthenticatedWithConsumerKey(options?: Partial<ConsumerKeyAuth>): options is ConsumerKeyAuth {
  return Boolean(options) && typeof options!.consumerKey === 'string' && typeof options!.consumerSecret === 'string'
}

function isAuthenticated(options?: DiscojsOptions) {
  return isAuthenticatedWithToken(options) || isAuthenticatedWithConsumerKey(options)
}

/**
 * Class.
 */

export class Discojs {
  public userAgent: string
  public outputFormat: OutputFormatsEnum
  private limiter: Bottleneck
  private fetchHeaders: Headers
  private fetchOptions: RequestInit

  constructor(options?: DiscojsOptions) {
    const {
      userAgent = DEFAULT_USER_AGENT,
      outputFormat = OutputFormatsEnum.DISCOGS,
      requestLimit = 25,
      requestLimitAuth = 60,
      requestLimitInterval = 60 * 1000,
      fetchOptions = {},
    } = options || {}

    this.userAgent = userAgent

    this.outputFormat = outputFormat

    this.limiter = createLimiter({
      maxRequests: isAuthenticated(options) ? requestLimitAuth : requestLimit,
      requestLimitInterval,
    })

    this.fetchOptions = fetchOptions

    this.fetchHeaders = new Headers({
      Accept: `application/vnd.discogs.${API_VERSION}.${this.outputFormat}+json`,
      'Accept-Encoding': 'gzip,deflate',
      Connection: 'close',
      'Content-Type': 'application/json',
      'User-Agent': this.userAgent,
    })

    if (isAuthenticatedWithToken(options)) this.fetchHeaders.set('Authorization', `Discogs token=${options.userToken}`)

    if (isAuthenticatedWithConsumerKey(options))
      this.fetchHeaders.set('Authorization', `Discogs key=${options.consumerKey}, secret=${options.consumerSecret}`)
  }

  /**
   * Static methods.
   */

  static getSupportedCurrencies() {
    return Object.values(CurrenciesEnum)
  }

  static getReleaseConditions() {
    return Object.values(ReleaseConditionsEnum)
  }

  static getSleeveConditions() {
    return Object.values(SleeveConditionsEnum)
  }

  /**
   * Private methods.
   */

  private async fetch<T>(uri: string, query?: Record<string, any>, method?: HTTPVerbsEnum, data?: Record<string, any>) {
    const options = {
      ...this.fetchOptions,
      method: method || HTTPVerbsEnum.GET,
    }

    const clonedHeaders = new Map(this.fetchHeaders)

    if (data) {
      const stringifiedData = JSON.stringify(transformData(data))
      options.body = stringifiedData

      clonedHeaders.set('Content-Type', 'application/json')
      clonedHeaders.set('Content-Length', Buffer.byteLength(stringifiedData, 'utf8').toString())
    }

    options.headers = Object.fromEntries(clonedHeaders)

    return this.limiter.schedule(async () =>
      fetch<T>(query && typeof query === 'object' ? `${BASE_URL + uri}?${stringify(query)}` : BASE_URL + uri, options),
    )
  }

  /**
   * Discogs methods.
   */

  // User - Identity
  // https://www.discogs.com/developers#page:user-identity,header:user-identity-identity

  async getIdentity() {
    return this.fetch<IdentityResponse>('/oauth/identity')
  }

  private async getUsername() {
    const { username } = await this.getIdentity()
    return username
  }

  // User - Profile
  // https://www.discogs.com/developers#page:user-identity,header:user-identity-profile

  async getProfileForUser(username: string) {
    return this.fetch<UserResponse>(`/users/${username}`)
  }

  async getProfile() {
    const username = await this.getUsername()
    return this.getProfileForUser(username)
  }

  async editProfile(options: ProfileOptions) {
    const username = await this.getUsername()
    return this.fetch<EditProfileResponse>(`/users/${username}`, {}, HTTPVerbsEnum.POST, { username, ...options })
  }

  // User - Submissions
  // https://www.discogs.com/developers#page:user-identity,header:user-identity-user-submissions

  async getSubmissionsForUser(username: string, pagination?: Pagination) {
    return this.fetch<UserSubmissionsResponse>(`/users/${username}/submissions`, paginate(pagination))
  }

  async getSubmissions(pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getSubmissionsForUser(username, pagination)
  }

  // User - Contributions
  // https://www.discogs.com/developers#page:user-identity,header:user-identity-user-contributions

  async getContributionsForUser(username: string, sort?: SortOptions<UserSortEnum>, pagination?: Pagination) {
    return this.fetch<UserContributionsResponse>(`/users/${username}/contributions`, {
      ...sortBy(UserSortEnum.ADDED, sort),
      ...paginate(pagination),
    })
  }

  async getContributions(sort: SortOptions<UserSortEnum>, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getContributionsForUser(username, sort, pagination)
  }

  // User - Collection
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-collection

  async listFoldersForUser(username: string) {
    return this.fetch<FoldersResponse>(`/users/${username}/collection/folders`)
  }

  async listFolders() {
    const username = await this.getUsername()
    return this.listFoldersForUser(username)
  }

  async createFolder(name: string) {
    const username = await this.getUsername()
    return this.fetch<Folder>(`/users/${username}/collection/folders`, {}, HTTPVerbsEnum.POST, { name })
  }

  // User - Collection - Collection Folder
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-folder

  async getFolderForUser(username: string, folderId: FolderIdsEnum | number) {
    return this.fetch<Folder>(`/users/${username}/collection/folders/${folderId}`)
  }

  async getFolder(folderId: FolderIdsEnum | number) {
    const username = await this.getUsername()
    return this.getFolderForUser(username, folderId)
  }

  async editFolder(folderId: FolderIdsEnum | number, name: string) {
    const username = await this.getUsername()
    return this.fetch<Folder>(`/users/${username}/collection/folders/${folderId}`, {}, HTTPVerbsEnum.POST, {
      name,
    })
  }

  async deleteFolder(folderId: FolderIdsEnum | number) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(`/users/${username}/collection/folders/${folderId}`, {}, HTTPVerbsEnum.DELETE)
  }

  // User - Collection - Items By Release
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-release

  async listItemsByReleaseForUser(username: string, release_id: number, pagination?: Pagination) {
    return this.fetch<FolderReleasesResponse>(
      `/users/${username}/collection/releases/${release_id}`,
      paginate(pagination),
    )
  }

  async listItemsByRelease(release_id: number, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.listItemsByReleaseForUser(username, release_id, pagination)
  }

  // User - Collection - Collection Items By Folder
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-folder

  async listItemsInFolderForUser(
    username: string,
    folderId: FolderIdsEnum | number,
    sort?: SortOptions<UserSortEnum>,
    pagination?: Pagination,
  ) {
    return this.fetch<FolderReleasesResponse>(`/users/${username}/collection/folders/${folderId}/releases`, {
      ...sortBy(UserSortEnum.ADDED, sort),
      ...paginate(pagination),
    })
  }

  async listItemsInFolder(folderId: FolderIdsEnum | number, sort?: SortOptions<UserSortEnum>, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.listItemsInFolderForUser(username, folderId, sort, pagination)
  }

  // User - Collection - Add To Collection Folder
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-add-to-collection-folder

  async addReleaseToFolder(releaseId: number, folderId: FolderIdsEnum | number = FolderIdsEnum.UNCATEGORIZED) {
    const username = await this.getUsername()
    return this.fetch<AddToFolderResponse>(
      `/users/${username}/collection/folders/${folderId}/releases/${releaseId}`,
      {},
      HTTPVerbsEnum.POST,
    )
  }

  // User - Collection - Change Rating Of Release
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-change-rating-of-release

  async editReleaseInstanceRating(
    folderId: FolderIdsEnum | number,
    releaseId: number,
    instanceId: number,
    rating: Range<0, 6>,
  ) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(
      `/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}`,
      {},
      HTTPVerbsEnum.POST,
      { rating },
    )
  }

  async moveReleaseInstanceToFolder(
    oldFolderId: FolderIdsEnum | number,
    releaseId: number,
    instanceId: number,
    newFolderId: FolderIdsEnum | number,
  ) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(
      `/users/${username}/collection/folders/${oldFolderId}/releases/${releaseId}/instances/${instanceId}`,
      {},
      HTTPVerbsEnum.POST,
      { folderId: newFolderId },
    )
  }

  // User - Collection - Delete Instance From Folder
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-delete-instance-from-folder

  async deleteReleaseInstanceFromFolder(folderId: FolderIdsEnum | number, releaseId: number, instanceId: number) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(
      `/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}`,
      {},
      HTTPVerbsEnum.DELETE,
    )
  }

  // User - Collection - List Custom Fields
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-list-custom-fields

  async listCustomFieldsForUser(username: string) {
    return this.fetch<CustomFieldsResponse>(`/users/${username}/collection/fields`)
  }

  async listCustomFields() {
    const username = await this.getUsername()
    return this.listCustomFieldsForUser(username)
  }

  // User - Collection - Edit Fields Instance
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-edit-fields-instance

  async editCustomFieldForInstance(
    folderId: FolderIdsEnum | number,
    releaseId: number,
    instanceId: number,
    fieldId: number,
    value: string,
  ) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(
      `/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}/fields/${fieldId}`,
      { value },
      HTTPVerbsEnum.POST,
    )
  }

  // User - Collection - Collection Value
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-value

  async getCollectionValue() {
    const username = await this.getUsername()
    return this.fetch<CollectionValueResponse>(`/users/${username}/collection/value`)
  }

  // User - Wantlist
  // https://www.discogs.com/developers#page:user-wantlist,header:user-wantlist-wantlist

  async getWantlistForUser(username: string, pagination?: Pagination) {
    return this.fetch<WantlistResponse>(`/users/${username}/wants`, paginate(pagination))
  }

  async getWantlist(pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getWantlistForUser(username, pagination)
  }

  // User - Wantlist - Add to wantlist
  // https://www.discogs.com/developers#page:user-wantlist,header:user-wantlist-add-to-wantlist

  async addToWantlist(releaseId: number, notes?: string, rating?: Range<0, 6>) {
    const username = await this.getUsername()
    return this.fetch<AddToWantlistResponse>(
      `/users/${username}/wants/${releaseId}`,
      { notes, rating },
      HTTPVerbsEnum.PUT,
    )
  }

  async removeFromWantlist(releaseId: number) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(`/users/${username}/wants/${releaseId}`, {}, HTTPVerbsEnum.DELETE)
  }

  // User - Lists
  // https://www.discogs.com/developers#page:user-lists,header:user-lists-user-lists

  async getListsForUser(username: string, pagination?: Pagination) {
    return this.fetch<UserListsResponse>(`/users/${username}/lists`, paginate(pagination))
  }

  async getLists(pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getListsForUser(username, pagination)
  }

  async getListItems(listId: number) {
    return this.fetch<UserListItemsResponse>(`/lists/${listId}`)
  }

  // Database - Search
  // https://www.discogs.com/developers#page:database,header:database-search

  async searchDatabase(options: SearchOptions = {}, pagination?: Pagination) {
    return this.fetch<SearchResponse>('/database/search', { ...options, ...paginate(pagination) })
  }

  // Database - Release
  // https://www.discogs.com/developers#page:database,header:database-release

  async searchRelease(query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.RELEASE }, pagination)
  }

  async getRelease(releaseId: number, currency?: CurrenciesEnum) {
    return this.fetch<Release>(`/releases/${releaseId}`, { currency })
  }

  // Database - Release - Rating by user
  // https://www.discogs.com/developers#page:database,header:database-release-rating-by-user

  async getReleaseRatingForUser(username: string, releaseId: number) {
    return this.fetch<ReleaseRatingResponse>(`/releases/${releaseId}/rating/${username}`)
  }

  async getReleaseRating(releaseId: number) {
    const username = await this.getUsername()
    return this.getReleaseRatingForUser(username, releaseId)
  }

  async updateReleaseRating(releaseId: number, rating: Range<0, 6>) {
    const username = await this.getUsername()
    return this.fetch<ReleaseRatingResponse>(`/releases/${releaseId}/rating/${username}`, {}, HTTPVerbsEnum.PUT, {
      rating,
    })
  }

  async deleteReleaseRating(releaseId: number) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(`/releases/${releaseId}/rating/${username}`, {}, HTTPVerbsEnum.DELETE)
  }

  // Database - Release - Community release rating
  // https://www.discogs.com/developers#page:database,header:database-community-release-rating

  async getCommunityReleaseRating(releaseId: number) {
    return this.fetch<CommunityReleaseRatingResponse>(`/releases/${releaseId}/rating`)
  }

  // Database - Master Release
  // https://www.discogs.com/developers#page:database,header:database-master-release

  async searchMaster(query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.MASTER }, pagination)
  }

  async getMaster(masterId: number) {
    return this.fetch<Master>(`/masters/${masterId}`)
  }

  // Database - Master Release Versions
  // https://www.discogs.com/developers#page:database,header:database-master-release-versions

  async getMasterVersions(masterId: number, pagination?: Pagination) {
    return this.fetch<MasterVersionsResponse>(`/masters/${masterId}/versions`, paginate(pagination))
  }

  // Database - Artist
  // https://www.discogs.com/developers#page:database,header:database-artist

  async searchArtist(query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.ARTIST }, pagination)
  }

  async getArtist(artistId: number) {
    return this.fetch<Artist>(`/artists/${artistId}`)
  }

  // Database - Artist Releases
  // https://www.discogs.com/developers#page:database,header:database-artist-releases

  async getArtistReleases(artistId: number, sort?: SortOptions<ReleaseSortEnum>, pagination?: Pagination) {
    return this.fetch<ReleasesResponse>(`/artists/${artistId}/releases`, {
      ...sortBy(ReleaseSortEnum.YEAR, sort),
      ...paginate(pagination),
    })
  }

  // Database - Label
  // https://www.discogs.com/developers#page:database,header:database-label

  async searchLabel(query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.LABEL }, pagination)
  }

  async getLabel(labelId: number) {
    return this.fetch<Label>(`/labels/${labelId}`)
  }

  // Database - Label Releases
  // https://www.discogs.com/developers#page:database,header:database-all-label-releases

  async getLabelReleases(labelId: number, pagination?: Pagination) {
    return this.fetch<ReleasesResponse>(`/labels/${labelId}/releases`, paginate(pagination))
  }

  // Marketplace - Inventory
  // https://www.discogs.com/developers#page:marketplace,header:marketplace-inventory

  async getInventoryForUser(
    username: string,
    status?: InventoryStatusesEnum,
    sort?: SortOptions<InventorySortEnum>,
    pagination?: Pagination,
  ) {
    return this.fetch<InventoryResponse>(`/users/${username}/inventory`, {
      status,
      ...sortBy(InventorySortEnum.LISTED, sort),
      ...paginate(pagination),
    })
  }

  async getInventory(status?: InventoryStatusesEnum, sort?: SortOptions<InventorySortEnum>, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getInventoryForUser(username, status, sort, pagination)
  }

  // Marketplace - Listing
  // https://www.discogs.com/developers#page:marketplace,header:marketplace-listing

  async getListing(listingId: number, currency?: CurrenciesEnum) {
    return this.fetch<Listing>(`/marketplace/listings/${listingId}`, { currency })
  }

  async editListing(listingId: number, options: ListingOptions, currency?: CurrenciesEnum) {
    return this.fetch<EmptyResponse>(`/marketplace/listings/${listingId}`, { currency }, HTTPVerbsEnum.POST, options)
  }

  async deleteListing(listingId: number) {
    return this.fetch<EmptyResponse>(`/marketplace/listings/${listingId}`, {}, HTTPVerbsEnum.DELETE)
  }

  async createListing(options: ListingOptions) {
    return this.fetch<CreateListingResponse>('/marketplace/listings/', {}, HTTPVerbsEnum.POST, options)
  }

  // Marketplace - Order
  // https://www.discogs.com/developers#page:marketplace,header:marketplace-order

  async getOrder(orderId: number) {
    return this.fetch<Order>(`/marketplace/orders/${orderId}`)
  }

  async editOrder(orderId: number, status?: EditOrderStatusesEnum, shipping?: number) {
    return this.fetch<Order>(`/marketplace/orders/${orderId}`, {}, HTTPVerbsEnum.POST, { status, shipping })
  }

  async listOrders(
    status?: OrderStatusesEnum,
    archived?: boolean,
    sort?: SortOptions<OrderSortEnum>,
    pagination?: Pagination,
  ) {
    return this.fetch<OrdersResponse>('/marketplace/orders', {
      status,
      archived,
      ...sortBy(OrderSortEnum.ID, sort),
      ...paginate(pagination),
    })
  }

  // Marketplace - Order Messages
  // https://www.discogs.com/developers#page:marketplace,header:marketplace-list-order-messages

  async listOrderMessages(orderId: number) {
    return this.fetch<OrderMessagesResponse>(`/marketplace/orders/${orderId}/messages`)
  }

  async sendOrderMessage(orderId: number, message?: string, status?: OrderStatusesEnum) {
    return this.fetch<OrderMessage>(`/marketplace/orders/${orderId}/messages`, {}, HTTPVerbsEnum.POST, {
      message,
      status,
    })
  }

  // Marketplace - Fee
  // https://www.discogs.com/developers#page:marketplace,header:marketplace-fee

  async getFee(price: number, currency?: CurrenciesEnum) {
    let uri = `/marketplace/fee/${price}`
    if (currency) uri += `/${currency}`

    return this.fetch<Fee>(uri)
  }

  // Marketplace - Price Suggestions
  // https://www.discogs.com/developers#page:marketplace,header:marketplace-price-suggestions

  async getPriceSuggestions(releaseId: number) {
    return this.fetch<PriceSuggestionsResponse>(`/marketplace/price_suggestions/${releaseId}`)
  }

  // Marketplace - Release Statistics
  // https://www.discogs.com/developers#page:marketplace,header:marketplace-release-statistics

  async getMarketplaceStatistics(releaseId: number, currency?: CurrenciesEnum) {
    return this.fetch<MarketplaceStatisticsResponse>(`/marketplace/stats/${releaseId}`, { currency })
  }
}

/**
 * Exports.
 */

export * from './constants'
export * from './discogsTypes'
export * from './errors'
