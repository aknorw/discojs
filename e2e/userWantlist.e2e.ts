import * as t from 'io-ts'

import { Discojs } from '../lib'

import { WantlistResponseIO, AddToWantlistResponseIO } from '../models'

declare const client: Discojs

const rodneyfool = 'rodneyfool'
const pagination = { page: 1, perPage: 1 }

describe('User Wantlist', () => {
  const releaseId = 3124045

  describe('Wantlist', () => {
    it('getWantlistForUser', async () => {
      const apiResponse = await client.getWantlistForUser(rodneyfool)
      expect(t.exact(WantlistResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getWantlistForUser - with pagination', async () => {
      const apiResponse = await client.getWantlistForUser(rodneyfool, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('getWantlist', async () => {
      const apiResponse = await client.getWantlist()
      expect(t.exact(WantlistResponseIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Add To Wantlist', () => {
    it('addToWantlist', async () => {
      const notes = `Test-${Math.random()}`
      const apiResponse = await client.addToWantlist(releaseId, notes, 4)
      expect(t.exact(AddToWantlistResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('removeFromWantlist', async () => {
      const apiResponse = await client.removeFromWantlist(releaseId)
      // Empty response has 0 keys
      expect(Object.keys(apiResponse).length).toEqual(0)
    })
  })
})
