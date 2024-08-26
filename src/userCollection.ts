import {
  AddToFolderResponse,
  CollectionValueResponse,
  CustomFieldsResponse,
  EmptyResponse,
  Folder,
  FolderReleasesResponse,
  FoldersResponse,
  RatingValues,
} from '../models'
import type { Discojs } from './discojs'
import { FolderIdsEnum, UserSortEnum } from './enums'
import { HTTPVerbsEnum, paginate, Pagination, sortBy, SortOptions } from './utils'

export class UserCollection {
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
  async listFoldersForUser(this: Discojs, username: string) {
    return this.fetcher.schedule<FoldersResponse>(`/users/${username}/collection/folders`)
  }

  /**
   * Retrieve a list of folders in authenticated user’s collection.
   *
   * @category User Collection
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection
   */
  async listFolders(this: Discojs) {
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
  async createFolder(this: Discojs, name: string) {
    const username = await this.getUsername()
    return this.fetcher.schedule<Folder>(`/users/${username}/collection/folders`, {}, HTTPVerbsEnum.POST, { name })
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
  async getFolderForUser(this: Discojs, username: string, folderId: FolderIdsEnum | number) {
    return this.fetcher.schedule<Folder>(`/users/${username}/collection/folders/${folderId}`)
  }

  /**
   * Retrieve metadata about a folder in authenticated user’s collection.
   *
   * @category User Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-folder
   */
  async getFolder(this: Discojs, folderId: FolderIdsEnum | number) {
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
  async editFolder(this: Discojs, folderId: FolderIdsEnum | number, name: string) {
    const username = await this.getUsername()
    return this.fetcher.schedule<Folder>(`/users/${username}/collection/folders/${folderId}`, {}, HTTPVerbsEnum.POST, {
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
  async deleteFolder(this: Discojs, folderId: FolderIdsEnum | number) {
    const username = await this.getUsername()
    return this.fetcher.schedule<EmptyResponse>(
      `/users/${username}/collection/folders/${folderId}`,
      {},
      HTTPVerbsEnum.DELETE,
    )
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
  async listItemsByReleaseForUser(this: Discojs, username: string, release_id: number, pagination?: Pagination) {
    return this.fetcher.schedule<FolderReleasesResponse>(
      `/users/${username}/collection/releases/${release_id}`,
      paginate(pagination),
    )
  }

  /**
   * View all user’s collection folders which contain a specified release. This will also show information about each release instance.
   *
   * @category User
   * @label Items By Release
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-release
   */
  listAllItemsByReleaseForUser(this: Discojs, username: string, release_id: number) {
    return this.fetcher.createAllMethod((pagination) =>
      this.listItemsByReleaseForUser(username, release_id, pagination),
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
  async listItemsByRelease(this: Discojs, release_id: number, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.listItemsByReleaseForUser(username, release_id, pagination)
  }

  /**
   * View all authenticated user’s collection folders which contain a specified release. This will also show information about each release instance.
   *
   * @category User
   * @label Items By Release
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-release
   */
  listAllItemsByRelease(this: Discojs, release_id: number) {
    return this.fetcher.createAllMethod((pagination) => this.listItemsByRelease(release_id, pagination))
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
    this: Discojs,
    username: string,
    folderId: FolderIdsEnum | number,
    sort?: SortOptions<UserSortEnum>,
    pagination?: Pagination,
  ) {
    return this.fetcher.schedule<FolderReleasesResponse>(`/users/${username}/collection/folders/${folderId}/releases`, {
      ...sortBy(UserSortEnum.ADDED, sort),
      ...paginate(pagination),
    })
  }

  /**
   * Returns all items in a folder in a user’s collection.
   *
   * @category User
   * @label Collection Items By Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-folder
   */
  listAllItemsInFolderForUser(
    this: Discojs,
    username: string,
    folderId: FolderIdsEnum | number,
    sort?: SortOptions<UserSortEnum>,
  ) {
    return this.fetcher.createAllMethod((pagination) =>
      this.listItemsInFolderForUser(username, folderId, sort, pagination),
    )
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
  async listItemsInFolder(
    this: Discojs,
    folderId: FolderIdsEnum | number,
    sort?: SortOptions<UserSortEnum>,
    pagination?: Pagination,
  ) {
    const username = await this.getUsername()
    return this.listItemsInFolderForUser(username, folderId, sort, pagination)
  }

  /**
   * Returns all items in a folder in authenticated user’s collection.
   *
   * @category User
   * @label Collection Items By Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-folder
   */
  listAllItemsInFolder(this: Discojs, folderId: FolderIdsEnum | number, sort?: SortOptions<UserSortEnum>) {
    return this.fetcher.createAllMethod((pagination) => this.listItemsInFolder(folderId, sort, pagination))
  }

  /**
   * Add a release to a folder in authenticated user’s collection.
   *
   * @category User
   * @label Add To Collection Folder
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-add-to-collection-folder
   */
  async addReleaseToFolder(
    this: Discojs,
    releaseId: number,
    folderId: FolderIdsEnum | number = FolderIdsEnum.UNCATEGORIZED,
  ) {
    const username = await this.getUsername()
    return this.fetcher.schedule<AddToFolderResponse>(
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
    this: Discojs,
    folderId: FolderIdsEnum | number,
    releaseId: number,
    instanceId: number,
    rating: RatingValues,
  ) {
    const username = await this.getUsername()
    return this.fetcher.schedule<EmptyResponse>(
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
    this: Discojs,
    oldFolderId: FolderIdsEnum | number,
    releaseId: number,
    instanceId: number,
    newFolderId: FolderIdsEnum | number,
  ) {
    const username = await this.getUsername()
    return this.fetcher.schedule<EmptyResponse>(
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
  async deleteReleaseInstanceFromFolder(
    this: Discojs,
    folderId: FolderIdsEnum | number,
    releaseId: number,
    instanceId: number,
  ) {
    const username = await this.getUsername()
    return this.fetcher.schedule<EmptyResponse>(
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
  async listCustomFieldsForUser(this: Discojs, username: string) {
    return this.fetcher.schedule<CustomFieldsResponse>(`/users/${username}/collection/fields`)
  }

  /**
   * Retrieve a list of authenticated user-defined collection notes fields. These fields are available on every release in the collection.
   *
   * @category User
   * @label List Custom Fields
   *
   * @link https://www.discogs.com/developers#page:user-collection,header:user-collection-list-custom-fields
   */
  async listCustomFields(this: Discojs) {
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
    this: Discojs,
    folderId: FolderIdsEnum | number,
    releaseId: number,
    instanceId: number,
    fieldId: number,
    value: string,
  ) {
    const username = await this.getUsername()
    return this.fetcher.schedule<EmptyResponse>(
      `/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}/fields/${fieldId}`,
      undefined,
      HTTPVerbsEnum.POST,
      { value },
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
  async getCollectionValue(this: Discojs) {
    const username = await this.getUsername()
    return this.fetcher.schedule<CollectionValueResponse>(`/users/${username}/collection/value`)
  }
}
