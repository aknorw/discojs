import {
  Artist,
  ArtistReleasesResponse,
  CommunityReleaseRatingResponse,
  EmptyResponse,
  Label,
  LabelReleasesResponse,
  Master,
  MasterVersionsResponse,
  RatingValues,
  Release,
  ReleaseRatingResponse,
  ReleaseStatsResponse,
  SearchResponse,
} from '../models'

import type { Discojs } from './discojs'
import { CurrenciesEnum, ReleaseSortEnum, SearchTypeEnum } from './enums'
import { HTTPVerbsEnum, paginate, Pagination, sortBy, SortOptions } from './utils'

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

export class Database {
  /**
   * Get a release.
   *
   * @category Database
   * @label Release
   *
   * @link https://www.discogs.com/developers#page:database,header:database-release
   */
  async getRelease(this: Discojs, releaseId: number, currency?: CurrenciesEnum) {
    return this.fetcher.schedule<Release>(`/releases/${releaseId}`, { currency })
  }

  /**
   * Retrieves the release’s rating for a given user.
   *
   * @category Database
   * @label Release Rating
   *
   * @link https://www.discogs.com/developers#page:database,header:database-release-rating-by-user
   */
  async getReleaseRatingForUser(this: Discojs, username: string, releaseId: number) {
    return this.fetcher.schedule<ReleaseRatingResponse>(`/releases/${releaseId}/rating/${username}`)
  }

  /**
   * Retrieves the release’s rating for the authenticated user.
   *
   * @category Database
   * @label Release Rating
   *
   * @link https://www.discogs.com/developers#page:database,header:database-release-rating-by-user
   */
  async getReleaseRating(this: Discojs, releaseId: number) {
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
  async updateReleaseRating(this: Discojs, releaseId: number, rating: RatingValues) {
    const username = await this.getUsername()
    return this.fetcher.schedule<ReleaseRatingResponse>(
      `/releases/${releaseId}/rating/${username}`,
      {},
      HTTPVerbsEnum.PUT,
      { rating },
    )
  }

  /**
   * Deletes the release’s rating for the authenticated user.
   *
   * @category Database
   * @label Release Rating
   *
   * @link https://www.discogs.com/developers#page:database,header:database-release-rating-by-user
   */
  async deleteReleaseRating(this: Discojs, releaseId: number) {
    const username = await this.getUsername()
    return this.fetcher.schedule<EmptyResponse>(`/releases/${releaseId}/rating/${username}`, {}, HTTPVerbsEnum.DELETE)
  }

  /**
   * Retrieves the community release rating average and count.
   *
   * @category Database
   * @label Community Release Rating
   *
   * @link https://www.discogs.com/developers#page:database,header:database-community-release-rating
   */
  async getCommunityReleaseRating(this: Discojs, releaseId: number) {
    return this.fetcher.schedule<CommunityReleaseRatingResponse>(`/releases/${releaseId}/rating`)
  }

  /**
   * Retrieves the total number of “haves” (in the community’s collections) and “wants” (in the community’s wantlists) for a given release.
   *
   * @category Database
   * @label Release Stats
   *
   * @link https://www.discogs.com/developers#page:database,header:database-release-stats
   *
   * Note: This endpoint is broken, see link below for a workaround.
   * @link https://www.discogs.com/fr/forum/thread/865093?message_id=8630743
   */
  async getReleaseStats(this: Discojs, releaseId: number): Promise<ReleaseStatsResponse> {
    const { community } = await this.getRelease(releaseId)
    return {
      num_have: community.have,
      num_want: community.want,
    }
  }

  /**
   * Get a master release.
   *
   * @category Database
   * @label Master Release
   *
   * @link https://www.discogs.com/developers#page:database,header:database-master-release
   */
  async getMaster(this: Discojs, masterId: number) {
    return this.fetcher.schedule<Master>(`/masters/${masterId}`)
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
  async getMasterVersions(this: Discojs, masterId: number, pagination?: Pagination) {
    return this.fetcher.schedule<MasterVersionsResponse>(`/masters/${masterId}/versions`, paginate(pagination))
  }

  getAllMasterVersions(this: Discojs, masterId: number) {
    return this.fetcher.createAllMethod((pagination) => this.getMasterVersions(masterId, pagination))
  }

  /**
   * Get an artist.
   *
   * @category Database
   * @label Artist
   *
   * @link https://www.discogs.com/developers#page:database,header:database-artist
   */
  async getArtist(this: Discojs, artistId: number) {
    return this.fetcher.schedule<Artist>(`/artists/${artistId}`)
  }

  /**
   * Returns a list of releases and masters associated with an artist.
   *
   * @category Database
   * @label Artist Releases
   *
   * @link https://www.discogs.com/developers#page:database,header:database-artist-releases
   */
  async getArtistReleases(
    this: Discojs,
    artistId: number,
    sort?: SortOptions<ReleaseSortEnum>,
    pagination?: Pagination,
  ) {
    return this.fetcher.schedule<ArtistReleasesResponse>(`/artists/${artistId}/releases`, {
      ...sortBy(ReleaseSortEnum.YEAR, sort),
      ...paginate(pagination),
    })
  }

  getAllArtistReleases(this: Discojs, artistId: number, sort?: SortOptions<ReleaseSortEnum>) {
    return this.fetcher.createAllMethod((pagination) => this.getArtistReleases(artistId, sort, pagination))
  }

  /**
   * Get a label.
   *
   * @category Database
   * @label Label
   *
   * @link https://www.discogs.com/developers#page:database,header:database-label
   */
  async getLabel(this: Discojs, labelId: number) {
    return this.fetcher.schedule<Label>(`/labels/${labelId}`)
  }

  /**
   * Returns a list of releases associated with the label.
   *
   * @category Database
   * @label Label Releases
   *
   * @link https://www.discogs.com/developers#page:database,header:database-all-label-releases
   */
  async getLabelReleases(this: Discojs, labelId: number, pagination?: Pagination) {
    return this.fetcher.schedule<LabelReleasesResponse>(`/labels/${labelId}/releases`, paginate(pagination))
  }

  getAllLabelReleases(this: Discojs, labelId: number) {
    return this.fetcher.createAllMethod((pagination) => this.getLabelReleases(labelId, pagination))
  }

  /**
   * Issue a search query to Discogs database.
   *
   * @category Database
   * @label Search
   *
   * @link https://www.discogs.com/developers#page:database,header:database-search
   */
  async searchDatabase(this: Discojs, options: SearchOptions = {}, pagination?: Pagination) {
    return this.fetcher.schedule<SearchResponse>('/database/search', { ...options, ...paginate(pagination) })
  }

  /**
   * Search for a release.
   *
   * @category Database
   * @label Search
   *
   * @link https://www.discogs.com/developers#page:database,header:database-search
   */
  async searchRelease(this: Discojs, query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.RELEASE }, pagination)
  }

  /**
   * Search for a master release.
   *
   * @category Database
   * @label Search
   *
   * @link https://www.discogs.com/developers#page:database,header:database-search
   */
  async searchMaster(this: Discojs, query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.MASTER }, pagination)
  }

  /**
   * Search for an artist.
   *
   * @category Database
   * @label Search
   *
   * @link https://www.discogs.com/developers#page:database,header:database-search
   */
  async searchArtist(this: Discojs, query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.ARTIST }, pagination)
  }

  /**
   * Search for a label.
   *
   * @category Database
   * @label Search
   *
   * @link https://www.discogs.com/developers#page:database,header:database-search
   */
  async searchLabel(this: Discojs, query: string, options: SearchOptions = {}, pagination?: Pagination) {
    return this.searchDatabase({ ...options, query, type: SearchTypeEnum.LABEL }, pagination)
  }
}
