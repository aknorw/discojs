import * as t from 'io-ts'

import { CurrenciesEnum, Discojs, ReleaseSortEnum, SortOrdersEnum } from '.'
import {
  ArtistReleasesResponseIO,
  CommunityReleaseRatingResponseIO,
  LabelReleasesResponseIO,
  MasterVersionsResponseIO,
  ReleaseRatingResponseIO,
  SearchResponseIO,
} from '../models/api'
import { ArtistIO } from '../models/artist'
import { LabelIO } from '../models/label'
import { MasterIO } from '../models/master'
import { ReleaseIO } from '../models/release'

declare const client: Discojs

const pagination = { page: 1, perPage: 1 }

describe('Database', () => {
  describe('Search', () => {
    // TODO - With pagination + test all options
    it('searchDatabase', async () => {
      const apiResponse = await client.searchDatabase()
      expect(t.exact(SearchResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('searchRelease', async () => {
      const apiResponse = await client.searchRelease('Number')
      expect(t.exact(SearchResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('searchMaster', async () => {
      const apiResponse = await client.searchMaster('Number')
      expect(t.exact(SearchResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('searchArtist', async () => {
      const apiResponse = await client.searchArtist('Jacob')
      expect(t.exact(SearchResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('searchLabel', async () => {
      const apiResponse = await client.searchLabel('Music')
      expect(t.exact(SearchResponseIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Release', () => {
    const releaseId = 249504

    it('getRelease', async () => {
      const apiResponse = await client.getRelease(releaseId)
      expect(t.exact(ReleaseIO).is(apiResponse)).toBeTruthy()
    })

    it('getRelease - with currency', async () => {
      const apiResponse = await client.getRelease(releaseId, CurrenciesEnum.SEK)
      expect(t.exact(ReleaseIO).is(apiResponse)).toBeTruthy()
    })

    it('getReleaseRatingForUser', async () => {
      const username = 'memory'
      const apiResponse = await client.getReleaseRatingForUser(username, releaseId)
      expect(t.exact(ReleaseRatingResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getReleaseRating', async () => {
      const apiResponse = await client.getReleaseRating(releaseId)
      expect(t.exact(ReleaseRatingResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('updateReleaseRating', async () => {
      const apiResponse = await client.updateReleaseRating(releaseId, 4)
      expect(t.exact(ReleaseRatingResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('deleteReleaseRating', async () => {
      const apiResponse = await client.deleteReleaseRating(releaseId)
      // Empty response has 0 keys
      expect(Object.keys(apiResponse).length).toEqual(0)
    })

    it('getCommunityReleaseRating', async () => {
      const apiResponse = await client.getCommunityReleaseRating(releaseId)
      expect(t.exact(CommunityReleaseRatingResponseIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Master', () => {
    const masterId = 1000

    it('getMaster', async () => {
      const apiResponse = await client.getMaster(masterId)
      expect(t.exact(MasterIO).is(apiResponse)).toBeTruthy()
    })

    it('getMasterVersions', async () => {
      const apiResponse = await client.getMasterVersions(masterId)
      expect(t.exact(MasterVersionsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getMasterVersions - with pagination', async () => {
      const apiResponse = await client.getMasterVersions(masterId, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })
  })

  describe('Artist', () => {
    const artistId = 108713

    it('getArtist', async () => {
      const apiResponse = await client.getArtist(artistId)
      expect(t.exact(ArtistIO).is(apiResponse)).toBeTruthy()
    })

    it('getArtistReleases', async () => {
      const apiResponse = await client.getArtistReleases(artistId)
      expect(t.exact(ArtistReleasesResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getArtistReleases - with sort', async () => {
      const by = ReleaseSortEnum.YEAR

      const firstApiResponse = await client.getArtistReleases(artistId, { by, order: SortOrdersEnum.ASC })
      // Check if there are at least 2 releases.
      expect(firstApiResponse.releases.length).toBeGreaterThanOrEqual(2)
      const firstId = firstApiResponse.releases[0].id

      const secondApiResponse = await client.getArtistReleases(artistId, { by, order: SortOrdersEnum.DESC })
      const secondId = secondApiResponse.releases[0].id

      expect(firstId).not.toEqual(secondId)
    })

    it('getArtistReleases - with pagination', async () => {
      const apiResponse = await client.getArtistReleases(artistId, undefined, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })
  })

  describe('Label', () => {
    const labelId = 1

    it('getLabel', async () => {
      const apiResponse = await client.getLabel(labelId)
      expect(t.exact(LabelIO).is(apiResponse)).toBeTruthy()
    })

    it('getLabelReleases', async () => {
      const apiResponse = await client.getLabelReleases(labelId)
      expect(t.exact(LabelReleasesResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getLabelReleases - with pagination', async () => {
      const apiResponse = await client.getLabelReleases(labelId, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })
  })
})
