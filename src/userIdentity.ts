import {
  EditUserProfileResponse,
  IdentityResponse,
  UserContributionsResponse,
  UserProfileResponse,
  UserSubmissionsResponse,
} from '../models'

import type { Discojs } from './discojs'
import { CurrenciesEnum, UserSortEnum } from './enums'
import { HTTPVerbsEnum, paginate, Pagination, sortBy, SortOptions } from './utils'

type ProfileOptions = {
  username?: string
  name?: string
  homePage?: string
  location?: string
  profile?: string
  currAbbr?: CurrenciesEnum
}

export class UserIdentity {
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
  async getIdentity(this: Discojs) {
    return this.fetcher.schedule<IdentityResponse>('/oauth/identity')
  }

  /**
   * Retrieve authenticated user's username.
   *
   * @remarks
   * Used internally within methods that use `username` as a param.
   *
   * @category User Identity
   *
   * @protected
   */
  protected async getUsername(this: Discojs) {
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
  async getProfileForUser(this: Discojs, username: string) {
    return this.fetcher.schedule<UserProfileResponse>(`/users/${username}`)
  }

  /**
   * Retrieve authenticated user's profile.
   *
   * @category User Profile
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-profile
   */
  async getProfile(this: Discojs) {
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
  async editProfile(this: Discojs, options: ProfileOptions) {
    const username = await this.getUsername()
    return this.fetcher.schedule<EditUserProfileResponse>(`/users/${username}`, {}, HTTPVerbsEnum.POST, {
      username,
      ...options,
    })
  }

  /**
   * Retrieve a user’s submissions by username.
   *
   * @category User Submissions
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-user-submissions
   */
  async getSubmissionsForUser(this: Discojs, username: string, pagination?: Pagination) {
    return this.fetcher.schedule<UserSubmissionsResponse>(`/users/${username}/submissions`, paginate(pagination))
  }

  getAllSubmissionsForUser(this: Discojs, username: string) {
    return this.fetcher.createAllMethod((pagination) => this.getSubmissionsForUser(username, pagination))
  }

  /**
   * Retrieve authenticated user’s submissions.
   *
   * @category User Submissions
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-user-submissions
   */
  async getSubmissions(this: Discojs, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getSubmissionsForUser(username, pagination)
  }

  getAllSubmissions(this: Discojs) {
    return this.fetcher.createAllMethod((pagination) => this.getSubmissions(pagination))
  }

  /**
   * Retrieve a user’s contributions by username.
   *
   * @category User Contributions
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-user-contributions
   */
  async getContributionsForUser(
    this: Discojs,
    username: string,
    sort?: SortOptions<UserSortEnum>,
    pagination?: Pagination,
  ) {
    return this.fetcher.schedule<UserContributionsResponse>(`/users/${username}/contributions`, {
      ...sortBy(UserSortEnum.ADDED, sort),
      ...paginate(pagination),
    })
  }

  getAllContributionsForUser(this: Discojs, username: string, sort?: SortOptions<UserSortEnum>) {
    return this.fetcher.createAllMethod((pagination) => this.getContributionsForUser(username, sort, pagination))
  }

  /**
   * Retrieve authenticated user’s contributions.
   *
   * @category User Contributions
   *
   * @link https://www.discogs.com/developers#page:user-identity,header:user-identity-user-contributions
   */
  async getContributions(this: Discojs, sort?: SortOptions<UserSortEnum>, pagination?: Pagination) {
    const username = await this.getUsername()
    return this.getContributionsForUser(username, sort, pagination)
  }

  getAllContributions(this: Discojs, sort?: SortOptions<UserSortEnum>) {
    return this.fetcher.createAllMethod((pagination) => this.getContributions(sort, pagination))
  }
}
