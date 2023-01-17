import { UserListItemsResponse, UserListsResponse } from '../models'
import type { Discojs } from './discojs'
import { paginate, Pagination } from './utils'

export class UserLists {
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
  async getListsForUser(this: Discojs, username: string, pagination?: Pagination) {
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
  async getLists(this: Discojs, pagination?: Pagination) {
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
  async getListItems(this: Discojs, listId: number) {
    return this.fetch<UserListItemsResponse>(`/lists/${listId}`)
  }
}
