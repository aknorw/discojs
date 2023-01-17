import { AddToWantlistResponse, EmptyResponse, RatingValues, WantlistResponse } from '../models'

import type { Discojs } from './discojs'
import { HTTPVerbsEnum, paginate, Pagination } from './utils'

export class UserWantlist {
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
  async getWantlistForUser(this: Discojs, username: string, pagination?: Pagination) {
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
  async getWantlist(this: Discojs, pagination?: Pagination) {
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
  async addToWantlist(this: Discojs, releaseId: number, notes?: string, rating?: RatingValues) {
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
  async removeFromWantlist(this: Discojs, releaseId: number) {
    const username = await this.getUsername()
    return this.fetch<EmptyResponse>(`/users/${username}/wants/${releaseId}`, {}, HTTPVerbsEnum.DELETE)
  }
}
