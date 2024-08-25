import * as t from 'io-ts'

import { Discojs, SortOrdersEnum, UserSortEnum } from '../lib'

import { UserSubmissionsResponseIO, UserContributionsResponseIO } from '../models/api'
import { IdentityIO, UserIO } from '../models/user'

declare const client: Discojs

const blindborges = 'blindborges'
const pagination = { page: 1, perPage: 1 }

describe('User Identity', () => {
  describe('Identity', () => {
    it('getIdentity', async () => {
      const apiResponse = await client.getIdentity()
      expect(t.exact(IdentityIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Profile', () => {
    it('getProfileForUser', async () => {
      const apiResponse = await client.getProfileForUser(blindborges)
      expect(t.exact(UserIO).is(apiResponse)).toBeTruthy()
    })

    it('getProfile', async () => {
      const apiResponse = await client.getProfile()
      expect(t.exact(UserIO).is(apiResponse)).toBeTruthy()
    })

    it('editProfile', async () => {
      const input = {
        name: Math.random().toString(),
        homePage: 'https://discojs',
        location: `Planet ${Math.random()}`,
        profile: 'Test',
      }
      const apiResponse = await client.editProfile(input)
      expect(t.exact(UserIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Submissions', () => {
    it('getSubmissionsForUser', async () => {
      const apiResponse = await client.getSubmissionsForUser(blindborges)
      expect(t.exact(UserSubmissionsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getSubmissionsForUser - with pagination', async () => {
      const apiResponse = await client.getSubmissionsForUser(blindborges, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('getSubmissions', async () => {
      const apiResponse = await client.getSubmissions(pagination)
      expect(t.exact(UserSubmissionsResponseIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Contributions', () => {
    const username = 'shooezgirl'

    it('getContributionsForUser', async () => {
      const apiResponse = await client.getContributionsForUser(username)
      expect(t.exact(UserContributionsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getContributionsForUser - with sort', async () => {
      const by = UserSortEnum.TITLE

      const firstApiResponse = await client.getContributionsForUser(username, { by, order: SortOrdersEnum.ASC })
      // Check if there are at least 2 contributions.
      expect(firstApiResponse.contributions.length).toBeGreaterThanOrEqual(2)
      const firstId = firstApiResponse.contributions[0].id

      const secondApiResponse = await client.getContributionsForUser(username, { by, order: SortOrdersEnum.DESC })
      const secondId = secondApiResponse.contributions[0].id

      expect(firstId).not.toEqual(secondId)
    })

    it('getSubmissionsForUser - with pagination', async () => {
      const apiResponse = await client.getContributionsForUser(username, undefined, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('getContributions', async () => {
      const apiResponse = await client.getContributions()
      expect(t.exact(UserContributionsResponseIO).is(apiResponse)).toBeTruthy()
    })
  })
})
