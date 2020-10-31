import Bottleneck from 'bottleneck'
import { Headers } from 'cross-fetch'
import OAuth from 'oauth-1.0a'

import {
  CurrenciesEnum,
  EditOrderStatusesEnum,
  FolderIdsEnum,
  InventorySortEnum,
  InventoryStatusesEnum,
  ListingStatusesEnum,
  OrderSortEnum,
  OrderStatusesEnum,
  ReleaseConditionsEnum,
  ReleaseSortEnum,
  SearchTypeEnum,
  SleeveConditionsEnum,
  UserSortEnum,
} from './constants'

import {
  addQueryToUri,
  createLimiter,
  fetch,
  HTTPVerbsEnum,
  paginate,
  Pagination,
  sortBy,
  SortOptions,
  transformData,
} from './utils'

import {
  AddToFolderResponse,
  AddToWantlistResponse,
  Artist,
  ArtistReleasesResponse,
  CollectionValueResponse,
  CommunityReleaseRatingResponse,
  CreateListingResponse,
  CustomFieldsResponse,
  EditUserProfileResponse,
  EmptyResponse,
  Fee,
  Folder,
  FolderReleasesResponse,
  FoldersResponse,
  IdentityResponse,
  InventoryResponse,
  Label,
  LabelReleasesResponse,
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
  SearchResponse,
  UserContributionsResponse,
  UserListItemsResponse,
  UserListsResponse,
  UserProfileResponse,
  UserSubmissionsResponse,
  WantlistResponse,
} from '../models'

/**
 * Base API URL to which URI will be appended.
 *
 * @internal
 */
const API_BASE_URL = 'https://api.discogs.com'

/**
 * Base URL dedicated to Discogs images.
 *
 * @internal
 */
const IMG_BASE_URL = 'https://img.discogs.com'

/**
 * Discogs API version.
 *
 * @internal
 */
const API_VERSION = 'v2'

/**
 * Default user-agent to be used in requests.
 *
 * @internal
 */
const DEFAULT_USER_AGENT = `Discojs/__packageVersion__`

type UserTokenAuth = {
  /** User token. */
  userToken: string
}

type ConsumerKeyAuth = {
  /** Consumer key. */
  consumerKey: string
  /** Consumer secret. */
  consumerSecret: string
  /** OAuth token. */
  oAuthToken: string
  /** OAuth token secret. */
  oAuthTokenSecret: string
}

// @TODO: Make a better limiter (one limit, no interval, should use headers from Discogs).
type LimiterOptions = {
  /** Number of requests per interval for unauthenticated requests. Defaults to 25. */
  requestLimit?: number
  /** Number of requests per interval for authenticated requests. Defaults to 60. */
  requestLimitAuth?: number
  /** Interval to use to throttle requests. Defaults to 60 seconds. */
  requestLimitInterval?: number
}

/**
 * Available output formats.
 *
 * @todo Edit types depending on chosen output format.
 */
enum OutputFormatsEnum {
  DISCOGS = 'discogs',
  // PLAIN = 'plaintext',
  // HTML = 'html',
}

interface DiscojsOptions extends Partial<UserTokenAuth>, Partial<ConsumerKeyAuth>, LimiterOptions {
  /**
   * User-agent to be used in requests.
   *
   * @default Discojs/{packageVersion}
   */
  userAgent?: string
  /**
   * Output format.
   *
   * @default discogs
   */
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

type RatingValues = 0 | 1 | 2 | 3 | 4 | 5

/**
 * Type guard to check if authenticated thanks to user token.
 *
 * @internal
 */
function isAuthenticatedWithToken(options?: Partial<UserTokenAuth>): options is UserTokenAuth {
  return Boolean(options) && typeof options!.userToken === 'string'
}

/**
 * Type guard to check if authenticated thanks to consumer key.
 *
 * @internal
 */
function isAuthenticatedWithConsumerKey(options?: Partial<ConsumerKeyAuth>): options is ConsumerKeyAuth {
  return (
    Boolean(options) &&
    typeof options!.consumerKey === 'string' &&
    typeof options!.consumerSecret === 'string' &&
    typeof options!.oAuthToken === 'string' &&
    typeof options!.oAuthTokenSecret === 'string'
  )
}

/**
 * Type guard to check whether requests are authenticated or not.
 *
 * @internal
 */
function isAuthenticated(options?: DiscojsOptions) {
  return isAuthenticatedWithToken(options) || isAuthenticatedWithConsumerKey(options)
}

/**
 * Discojs.
 */

export class Discojs {
  public userAgent: string
  public outputFormat: OutputFormatsEnum
  private limiter: Bottleneck
  private fetchHeaders: Headers
  private setAuthorizationHeader?: (url?: string, method?: HTTPVerbsEnum) => string
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

    if (isAuthenticatedWithToken(options)) this.setAuthorizationHeader = () => `Discogs token=${options.userToken}`

    if (isAuthenticatedWithConsumerKey(options)) {
      const oAuth = new OAuth({
        consumer: { key: options.consumerKey, secret: options.consumerSecret },
        signature_method: 'PLAINTEXT',
        version: '1.0',
      })

      this.setAuthorizationHeader = (url?: string, method?: HTTPVerbsEnum) => {
        if (!url || !method) return ''

        const authObject = oAuth.authorize(
          { url, method },
          { key: options.oAuthToken, secret: options.oAuthTokenSecret },
        )

        return oAuth.toHeader(authObject).Authorization
      }
    }
  }

  /**
   * Return currencies supported by Discogs.
   *
   * @category Helpers
   *
   * @static
   */
  static getSupportedCurrencies() {
    return Object.values(CurrenciesEnum)
  }

  /**
   * Return release conditions supported by Discogs.
   *
   * @category Helpers
   *
   * @static
   */
  static getReleaseConditions() {
    return Object.values(ReleaseConditionsEnum)
  }

  /**
   * Return slevve conditions supported by Discogs.
   *
   * @category Helpers
   *
   * @static
   */
  static getSleeveConditions() {
    return Object.values(SleeveConditionsEnum)
  }

  /**
   * Private method used within other methods.
   *
   * @private
   * @internal
   */
  private async fetch<T>(uri: string, query?: Record<string, any>, method?: HTTPVerbsEnum, data?: Record<string, any>) {
    const isImgEndpoint = uri.startsWith(IMG_BASE_URL)
    const endpoint = isImgEndpoint
      ? uri
      : API_BASE_URL + (query && typeof query === 'object' ? addQueryToUri(uri, query) : uri)

    const options = {
      ...this.fetchOptions,
      method: method || HTTPVerbsEnum.GET,
    }

    // Set Authorization header.
    if (this.setAuthorizationHeader)
      this.fetchHeaders.set('Authorization', this.setAuthorizationHeader(uri, method || HTTPVerbsEnum.GET))

    const clonedHeaders = new Map(this.fetchHeaders)

    if (data) {
      const stringifiedData = JSON.stringify(transformData(data))
      options.body = stringifiedData

      clonedHeaders.set('Content-Type', 'application/json')
      clonedHeaders.set('Content-Length', Buffer.byteLength(stringifiedData, 'utf8').toString())
    }

    options.headers = Object.fromEntries(clonedHeaders)

    return this.limiter.schedule(() => fetch<T>(endpoint, options, isImgEndpoint))
  }

  /**
   * Retrieve basic information about the authenticated user.
   *
   * @remarks
   * You can use this resource to find out who you’re authenticated as, and it also doubles as a good sanity check to ensure that you’re using OAuth correctly.
   *
   * @category User Identity
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-identity
   */
  async getIdentity() {
    return this.fetch<IdentityResponse>('/oauth/identity')
  }

  /**
   * Retrieve authenticated user's username.
   *
   * @remarks
   * Used internally within methods that use `username` as a param.
   *
   * @category User Identity
   *
   * @private
   */
  private async getUsername() {
    const { username } = await this.getIdentity()
    return username
  }

  /**
   * Retrieve user's profile by username.
   *
   * @remarks
   * If authenticated as the requested user, the `email` key will be visible, and the `num_list count` will include the user’s private lists.
   * If authenticated as the requested user or the user’s collection/wantlist is public, the `num_collection` / `num_wantlist` keys will be visible.
   *
   * @category User Profile
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-profile
   */
  async getProfileForUser(username: string) {
    return this.fetch<UserProfileResponse>(`/users/${username}`)
  }

  /**
   * Retrieve authenticated user's profile.
   *
   * @category User Profile
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-profile
   */
  async getProfile() {
    const username = await this.getUsername()
    return this.getProfileForUser(username)
  }

  /**
   * Edit a user’s profile data.
   *
   * @category User Profile
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-profile
   */
  async editProfile(options: ProfileOptions) {
    const username = await this.getUsername()
    return this.fetch<EditUserProfileResponse>(`/users/${username}`, {}, HTTPVerbsEnum.POST, { username, ...options })
  }

  /**
   * Retrieve a user’s submissions by username.
   *
   * @category User Submissions
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-user-submissions
   */
  async getSubmissionsForUser(username: string, pagination?: Pagination) {
    return this.fetch<UserSubmissionsResponse>(`/users/${username}/submissions`, paginate(pagination))
  }

  /**
   * Retrieve authenticated user’s submissions.
   *
   * @category User Submissions
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-user-submissions
   */
  async getSubmissions(pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getSubmissionsForUser(username, pagination)
  }

  /**
   * Retrieve a user’s contributions by username.
   *
   * @category User Contributions
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-user-contributions
   */
  async getContributionsForUser(username: string, sort?: SortOptions<UserSortEnum>, pagination?: Pagination) {
    return this.fetch<UserContributionsResponse>(`/users/${username}/contributions`, {
      ...sortBy(UserSortEnum.ADDED, sort),
      ...paginate(pagination),
    })
  }

  /**
   * Retrieve authenticated user’s contributions.
   *
   * @category User Contributions
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-user-contributions
   */
  async getContributions(sort?: SortOptions<UserSortEnum>, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getContributionsForUser(username, sort, pagination)
  }

  /**
   * Retrieve a list of folders in a user’s collection.
   *
   * @remarks
   * If the collection has been made private by its owner, authentication as the collection owner is required.
   * If you are not authenticated as the collection owner, only folder ID 0 (the “All” folder) will be visible (if the requested user’s collection is public).
   *
   * @category User Collection
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection
   */
  async listFoldersForUser(username: string) {
    return this.fetch<FoldersResponse>(`/users/${username}/collection/folders`)
  }

  /**
   * Retrieve a list of folders in authenticated user’s collection.
   *
   * @category User Collection
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection
   */
  async listFolders() {
    const username = await this.getUsername()
    return this.listFoldersForUser(username)
  }

  /**
   * Create a new folder in authenticated user’s collection.
   *
   * @category User Collection
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection
   */
  async createFolder(name: string) {
    const username = await this.getUsername()
    return this.fetch<Folder>(`/users/${username}/collection/folders`, {}, HTTPVerbsEnum.POST, { name })
  }

  /**
   * Retrieve metadata about a folder in a user’s collection.
   *
   * @remarks
   * If folder_id is not 0, authentication as the collection owner is required.
   *
   * @category User Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-folder
   */
  async getFolderForUser(username: string, folderId: FolderIdsEnum | number) {
    return this.fetch<Folder>(`/users/${username}/collection/folders/${folderId}`)
  }

  /**
   * Retrieve metadata about a folder in authenticated user’s collection.
   *
   * @category User Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-folder
   */
  async getFolder(folderId: FolderIdsEnum | number) {
    const username = await this.getUsername()
    return this.getFolderForUser(username, folderId)
  }

  /**
   * Edit a folder’s metadata.
   *
   * @remarks
   * Folders 0 and 1 cannot be renamed.
   *
   * @category User Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-folder
   */
  async editFolder(folderId: FolderIdsEnum | number, name: string) {
    const username = await this.getUsername()
    return this.fetch<Folder>(`/users/${username}/collection/folders/${folderId}`, {}, HTTPVerbsEnum.POST, {
      name,
    })
  }

  /**
   * Delete a folder from a user’s collection.
   *
   * @remarks
   * A folder must be empty before it can be deleted.
   *
   * @category User Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-folder
   */
  async deleteFolder(folderId: FolderIdsEnum | number) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(`/users/${username}/collection/folders/${folderId}`, {}, HTTPVerbsEnum.DELETE)
  }

  /**
   * View the user’s collection folders which contain a specified release. This will also show information about each release instance.
   *
   * @remarks
   * Authentication as the collection owner is required if the owner’s collection is private.
   *
   * @category User
   * @label Items By Release
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-release
   */
  async listItemsByReleaseForUser(username: string, release_id: number, pagination?: Pagination) {
    return this.fetch<FolderReleasesResponse>(
      `/users/${username}/collection/releases/${release_id}`,
      paginate(pagination),
    )
  }

  /**
   * View authenticated user’s collection folders which contain a specified release. This will also show information about each release instance.
   *
   * @category User
   * @label Items By Release
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-release
   */
  async listItemsByRelease(release_id: number, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.listItemsByReleaseForUser(username, release_id, pagination)
  }

  /**
   * Returns the list of item in a folder in a user’s collection.
   *
   * @remarks
   * Basic information about each release is provided, suitable for display in a list. For detailed information, make another API call to fetch the corresponding release.
   * If folder_id is not 0, or the collection has been made private by its owner, authentication as the collection owner is required.
   * If you are not authenticated as the collection owner, only public notes fields will be visible.
   *
   * @category User
   * @label Collection Items By Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-folder
   */
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

  /**
   * Returns the list of item in a folder in authenticated user’s collection.
   *
   * @remarks
   * Basic information about each release is provided, suitable for display in a list. For detailed information, make another API call to fetch the corresponding release.
   *
   * @category User
   * @label Collection Items By Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-folder
   */
  async listItemsInFolder(folderId: FolderIdsEnum | number, sort?: SortOptions<UserSortEnum>, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.listItemsInFolderForUser(username, folderId, sort, pagination)
  }

  /**
   * Add a release to a folder in authenticated user’s collection.
   *
   * @category User
   * @label Add To Collection Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-add-to-collection-folder
   */
  async addReleaseToFolder(releaseId: number, folderId: FolderIdsEnum | number = FolderIdsEnum.UNCATEGORIZED) {
    const username = await this.getUsername()
    return this.fetch<AddToFolderResponse>(
      `/users/${username}/collection/folders/${folderId}/releases/${releaseId}`,
      {},
      HTTPVerbsEnum.POST,
    )
  }

  /**
   * Change the rating on a release.
   *
   * @category User
   * @label Change Rating Of Release
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-change-rating-of-release
   */
  async editReleaseInstanceRating(
    folderId: FolderIdsEnum | number,
    releaseId: number,
    instanceId: number,
    rating: RatingValues,
  ) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(
      `/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}`,
      {},
      HTTPVerbsEnum.POST,
      { rating },
    )
  }

  /**
   * Move the instance of a release to another folder.
   *
   * @category User
   * @label Change Rating Of Release
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-change-rating-of-release
   */
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

  /**
   * Remove an instance of a release from authenticated user’s collection folder.
   *
   * @category User
   * @label Delete Instance From Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-delete-instance-from-folder
   */
  async deleteReleaseInstanceFromFolder(folderId: FolderIdsEnum | number, releaseId: number, instanceId: number) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(
      `/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}`,
      {},
      HTTPVerbsEnum.DELETE,
    )
  }

  /**
   * Retrieve a list of user-defined collection notes fields. These fields are available on every release in the collection.
   *
   * @remarks
   * If the collection has been made private by its owner, authentication as the collection owner is required.
   * If you are not authenticated as the collection owner, only fields with `public` set to true will be visible.
   *
   * @category User
   * @label List Custom Fields
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-list-custom-fields
   */
  async listCustomFieldsForUser(username: string) {
    return this.fetch<CustomFieldsResponse>(`/users/${username}/collection/fields`)
  }

  /**
   * Retrieve a list of authenticated user-defined collection notes fields. These fields are available on every release in the collection.
   *
   * @category User
   * @label List Custom Fields
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-list-custom-fields
   */
  async listCustomFields() {
    const username = await this.getUsername()
    return this.listCustomFieldsForUser(username)
  }

  /**
   * Change the value of a notes field on a particular instance.
   *
   * @category User
   * @label Edit Fields Instance
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-edit-fields-instance
   */
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

  /**
   * Returns the minimum, median, and maximum value of authenticated user’s collection.
   *
   * @requires authentication
   *
   * @category User
   * @label Collection Value
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-value
   */
  async getCollectionValue() {
    const username = await this.getUsername()
    return this.fetch<CollectionValueResponse>(`/users/${username}/collection/value`)
  }

  /**
   * Returns the list of releases in a user’s wantlist.
   * Basic information about each release is provided, suitable for display in a list.
   * For detailed information, make another API call to fetch the corresponding release.
   *
   * @remarks
   * If the wantlist has been made private by its owner, you must be authenticated as the owner to view it.
   * The `notes` field will be visible if you are authenticated as the wantlist owner.
   *
   * @category User
   * @label Wantlist
   *
   * @link https://www.discogs.com/developers#page:user-wantlist,header:user-wantlist-wantlist
   */
  async getWantlistForUser(username: string, pagination?: Pagination) {
    return this.fetch<WantlistResponse>(`/users/${username}/wants`, paginate(pagination))
  }

  /**
   * Returns the list of releases in authenticated user’s wantlist.
   * Basic information about each release is provided, suitable for display in a list.
   * For detailed information, make another API call to fetch the corresponding release.
   *
   * @category User
   * @label Wantlist
   *
   * @link https://www.discogs.com/developers#page:user-wantlist,header:user-wantlist-wantlist
   */
  async getWantlist(pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getWantlistForUser(username, pagination)
  }

  /**
   * Add a release to authenticated user’s wantlist.
   *
   * @category User
   * @label Add to wantlist
   *
   * @link https://www.discogs.com/developers#page:user-wantlist,header:user-wantlist-add-to-wantlist
   */
  async addToWantlist(releaseId: number, notes?: string, rating?: RatingValues) {
    const username = await this.getUsername()
    return this.fetch<AddToWantlistResponse>(
      `/users/${username}/wants/${releaseId}`,
      { notes, rating },
      HTTPVerbsEnum.PUT,
    )
  }

  /**
   * Remove a release to authenticated user’s wantlist.
   *
   * @category User
   * @label Add to wantlist
   *
   * @link https://www.discogs.com/developers#page:user-wantlist,header:user-wantlist-add-to-wantlist
   */
  async removeFromWantlist(releaseId: number) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(`/users/${username}/wants/${releaseId}`, {}, HTTPVerbsEnum.DELETE)
  }

  /**
   * Returns user’s lists.
   *
   * @remarks
   * Private lists will only display when authenticated as the owner.
   *
   * @category User
   * @label Lists
   *
   * @link https://www.discogs.com/developers#page:user-lists,header:user-lists-user-lists
   */
  async getListsForUser(username: string, pagination?: Pagination) {
    return this.fetch<UserListsResponse>(`/users/${username}/lists`, paginate(pagination))
  }

  /**
   * Returns authenticated user’s lists.
   *
   * @category User
   * @label Lists
   *
   * @link https://www.discogs.com/developers#page:user-lists,header:user-lists-user-lists
   */
  async getLists(pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getListsForUser(username, pagination)
  }

  /**
   * Returns items from a specified list.
   *
   * @remarks
   * Private lists will only display when authenticated as the owner.
   *
   * @category User
   * @label Lists
   *
   * @link https://www.discogs.com/developers#page:user-lists,header:user-lists-user-lists
   */
  async getListItems(listId: number) {
    return this.fetch<UserListItemsResponse>(`/lists/${listId}`)
  }

  /**
   * Issue a search query to Discogs database.
   *
   * @category Database
   * @label Search
   *
   * @link https://www.discogs.com/developers#page:database,header:database-search
   */
  async searchDatabase(options: SearchOptions = {}, pagination?: Pagination) {
    return this.fetch<SearchResponse>('/database/search', { ...options, ...paginate(pagination) })
  }

  /**
   * Search for a release.
   *
   * @category Database
   * @label Search
   *
   * @link https://www.discogs.com/developers#page:database,header:database-search
   */
  async searchRelease(query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.RELEASE }, pagination)
  }

  /**
   * Get a release.
   *
   * @category Database
   * @label Release
   *
   * @link https://www.discogs.com/developers#page:database,header:database-release
   */
  async getRelease(releaseId: number, currency?: CurrenciesEnum) {
    return this.fetch<Release>(`/releases/${releaseId}`, { currency })
  }

  /**
   * Retrieves the release’s rating for a given user.
   *
   * @category Database
   * @label Release Rating
   *
   * @link https://www.discogs.com/developers#page:database,header:database-release-rating-by-user
   */
  async getReleaseRatingForUser(username: string, releaseId: number) {
    return this.fetch<ReleaseRatingResponse>(`/releases/${releaseId}/rating/${username}`)
  }

  /**
   * Retrieves the release’s rating for the authenticated user.
   *
   * @category Database
   * @label Release Rating
   *
   * @link https://www.discogs.com/developers#page:database,header:database-release-rating-by-user
   */
  async getReleaseRating(releaseId: number) {
    const username = await this.getUsername()
    return this.getReleaseRatingForUser(username, releaseId)
  }

  /**
   * Updates the release’s rating for the authenticated user.
   *
   * @category Database
   * @label Release Rating
   *
   * @link https://www.discogs.com/developers#page:database,header:database-release-rating-by-user
   */
  async updateReleaseRating(releaseId: number, rating: RatingValues) {
    const username = await this.getUsername()
    return this.fetch<ReleaseRatingResponse>(`/releases/${releaseId}/rating/${username}`, {}, HTTPVerbsEnum.PUT, {
      rating,
    })
  }

  /**
   * Deletes the release’s rating for the authenticated user.
   *
   * @category Database
   * @label Release Rating
   *
   * @link https://www.discogs.com/developers#page:database,header:database-release-rating-by-user
   */
  async deleteReleaseRating(releaseId: number) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(`/releases/${releaseId}/rating/${username}`, {}, HTTPVerbsEnum.DELETE)
  }

  /**
   * Retrieves the community release rating average and count.
   *
   * @category Database
   * @label Community Release Rating
   *
   * @link https://www.discogs.com/developers#page:database,header:database-community-release-rating
   */
  async getCommunityReleaseRating(releaseId: number) {
    return this.fetch<CommunityReleaseRatingResponse>(`/releases/${releaseId}/rating`)
  }

  /**
   * Search for a master release.
   *
   * @category Database
   * @label Search
   *
   * @link https://www.discogs.com/developers#page:database,header:database-search
   */
  async searchMaster(query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.MASTER }, pagination)
  }

  /**
   * Get a master release.
   *
   * @category Database
   * @label Master Release
   *
   * @link https://www.discogs.com/developers#page:database,header:database-master-release
   */
  async getMaster(masterId: number) {
    return this.fetch<Master>(`/masters/${masterId}`)
  }

  /**
   * Retrieves a list of all releases that are versions of a master.
   *
   * @category Database
   * @label Master Release Versions
   *
   * @link https://www.discogs.com/developers#page:database,header:database-master-release-versions
   */
  // @TODO: There are a lot of parameters not handled here
  async getMasterVersions(masterId: number, pagination?: Pagination) {
    return this.fetch<MasterVersionsResponse>(`/masters/${masterId}/versions`, paginate(pagination))
  }

  /**
   * Search for an artist.
   *
   * @category Database
   * @label Search
   *
   * @link https://www.discogs.com/developers#page:database,header:database-search
   */
  async searchArtist(query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.ARTIST }, pagination)
  }

  /**
   * Get an artist.
   *
   * @category Database
   * @label Artist
   *
   * @link https://www.discogs.com/developers#page:database,header:database-artist
   */
  async getArtist(artistId: number) {
    return this.fetch<Artist>(`/artists/${artistId}`)
  }

  /**
   * Returns a list of releases and masters associated with an artist.
   *
   * @category Database
   * @label Artist Releases
   *
   * @link https://www.discogs.com/developers#page:database,header:database-artist-releases
   */
  async getArtistReleases(artistId: number, sort?: SortOptions<ReleaseSortEnum>, pagination?: Pagination) {
    return this.fetch<ArtistReleasesResponse>(`/artists/${artistId}/releases`, {
      ...sortBy(ReleaseSortEnum.YEAR, sort),
      ...paginate(pagination),
    })
  }

  /**
   * Search for a label.
   *
   * @category Database
   * @label Search
   *
   * @link https://www.discogs.com/developers#page:database,header:database-search
   */
  async searchLabel(query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.LABEL }, pagination)
  }

  /**
   * Get a label.
   *
   * @category Database
   * @label Label
   *
   * @link https://www.discogs.com/developers#page:database,header:database-label
   */
  async getLabel(labelId: number) {
    return this.fetch<Label>(`/labels/${labelId}`)
  }

  /**
   * Returns a list of releases associated with the label.
   *
   * @category Database
   * @label Label Releases
   *
   * @link https://www.discogs.com/developers#page:database,header:database-all-label-releases
   */
  async getLabelReleases(labelId: number, pagination?: Pagination) {
    return this.fetch<LabelReleasesResponse>(`/labels/${labelId}/releases`, paginate(pagination))
  }

  /**
   * Get a seller’s inventory.
   *
   * @remarks
   * If you are not authenticated as the inventory owner, only items that have a status of For Sale will be visible.
   * If you are authenticated as the inventory owner you will get additional weight, format_quantity, external_id, and location keys.
   * If the user is authorized, the listing will contain a `in_cart` boolean field indicating whether or not this listing is in their cart.
   *
   * @category Marketplace
   * @label Inventory
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-inventory
   */
  async getInventoryForUser(
    username: string,
    status: InventoryStatusesEnum = InventoryStatusesEnum.ALL,
    sort?: SortOptions<InventorySortEnum>,
    pagination?: Pagination,
  ) {
    return this.fetch<InventoryResponse>(`/users/${username}/inventory`, {
      status,
      ...sortBy(InventorySortEnum.LISTED, sort),
      ...paginate(pagination),
    })
  }

  /**
   * Get authenticated user’s inventory.
   *
   * @category Marketplace
   * @label Inventory
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-inventory
   */
  async getInventory(status?: InventoryStatusesEnum, sort?: SortOptions<InventorySortEnum>, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getInventoryForUser(username, status, sort, pagination)
  }

  /**
   * View the data associated with a listing.
   *
   * @remarks
   * If the authorized user is the listing owner the listing will include the weight, format_quantity, external_id, and location keys.
   * If the user is authorized, the listing will contain a in_cart boolean field indicating whether or not this listing is in their cart.
   *
   * @category Marketplace
   * @label Listing
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-listing
   */
  async getListing(listingId: number, currency?: CurrenciesEnum) {
    return this.fetch<Listing>(`/marketplace/listings/${listingId}`, { currency })
  }

  /**
   * Edit the data associated with a listing.
   *
   * @remarks
   * If the listing’s status is not For Sale, Draft, or Expired, it cannot be modified – only deleted.
   *
   * @category Marketplace
   * @label Listing
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-listing
   */
  async editListing(listingId: number, options: ListingOptions, currency?: CurrenciesEnum) {
    return this.fetch<EmptyResponse>(`/marketplace/listings/${listingId}`, { currency }, HTTPVerbsEnum.POST, options)
  }

  /**
   * Permanently remove a listing from the Marketplace.
   *
   * @category Marketplace
   * @label Listing
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-listing
   */
  async deleteListing(listingId: number) {
    return this.fetch<EmptyResponse>(`/marketplace/listings/${listingId}`, {}, HTTPVerbsEnum.DELETE)
  }

  /**
   * Create a Marketplace listing.
   *
   * @category Marketplace
   * @label Listing
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-new-listing
   */
  async createListing(options: ListingOptions) {
    return this.fetch<CreateListingResponse>('/marketplace/listings/', {}, HTTPVerbsEnum.POST, options)
  }

  /**
   * View the data associated with an order.
   *
   * @category Marketplace
   * @label Order
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-order
   */
  async getOrder(orderId: number) {
    return this.fetch<Order>(`/marketplace/orders/${orderId}`)
  }

  /**
   * Edit the data associated with an order.
   *
   * @category Marketplace
   * @label Order
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-order
   */
  async editOrder(orderId: number, status?: EditOrderStatusesEnum, shipping?: number) {
    return this.fetch<Order>(`/marketplace/orders/${orderId}`, {}, HTTPVerbsEnum.POST, { status, shipping })
  }

  /**
   * Returns a list of the authenticated user’s orders.
   *
   * @category Marketplace
   * @label Order
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-list-orders
   */
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

  /**
   * Returns a list of the order’s messages with the most recent first.
   *
   * @category Marketplace
   * @label Order Messages
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-list-order-messages
   */
  async listOrderMessages(orderId: number) {
    return this.fetch<OrderMessagesResponse>(`/marketplace/orders/${orderId}/messages`)
  }

  /**
   * Adds a new message to the order’s message log.
   *
   * @remarks
   * When posting a new message, you can simultaneously change the order status.
   * If you do, the message will automatically be prepended with: "Seller changed status from `Old Status` to `New Status`"
   * While message and status are each optional, one or both must be present.
   *
   * @category Marketplace
   * @label Order Messages
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-list-order-messages
   */
  async sendOrderMessage(orderId: number, message?: string, status?: OrderStatusesEnum) {
    return this.fetch<OrderMessage>(`/marketplace/orders/${orderId}/messages`, {}, HTTPVerbsEnum.POST, {
      message,
      status,
    })
  }

  /**
   * The Fee resource allows you to quickly calculate the fee for selling an item on the Marketplace.
   *
   * @category Marketplace
   * @label Fee
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-fee
   */
  async getFee(price: number, currency?: CurrenciesEnum) {
    let uri = `/marketplace/fee/${price}`
    if (currency) uri += `/${currency}`

    return this.fetch<Fee>(uri)
  }

  /**
   * Retrieve price suggestions for the provided Release ID.
   *
   * @remarks
   * Suggested prices will be denominated in the user’s selling currency.
   *
   * @category Marketplace
   * @label Price Suggestions
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-price-suggestions
   */
  async getPriceSuggestions(releaseId: number) {
    return this.fetch<PriceSuggestionsResponse>(`/marketplace/price_suggestions/${releaseId}`)
  }

  /**
   * Retrieve marketplace statistics for the provided Release ID.
   *
   * @remarks
   * These statistics reflect the state of the release in the marketplace currently, and include the number of items currently for sale,
   * lowest listed price of any item for sale, and whether the item is blocked for sale in the marketplace.
   *
   *
   * @category Marketplace
   * @label Release Statistics
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-release-statistics
   */
  async getMarketplaceStatistics(releaseId: number, currency?: CurrenciesEnum) {
    return this.fetch<MarketplaceStatisticsResponse>(`/marketplace/stats/${releaseId}`, { currency })
  }

  /**
   * Retrieve an image retrieved in another response.
   *
   * @requires authentication
   *
   * @category Helpers
   *
   * @link https://www.discogs.com/developers#page:images
   */
  async fetchImage(imageUrl: string) {
    return this.fetch<Blob>(imageUrl)
  }
}
