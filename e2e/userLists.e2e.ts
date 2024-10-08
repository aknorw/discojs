import * as t from 'io-ts'

import { UserListItemsResponseIO, UserListsResponseIO } from '../models'
import { Discojs } from '../src'

declare const client: Discojs

const blindborges = 'blindborges'
const pagination = { page: 1, perPage: 1 }

describe('User Lists', () => {
  describe('User Lists', () => {
    it('getListsForUser', async () => {
      const apiResponse = await client.getListsForUser(blindborges)
      expect(t.exact(UserListsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getListsForUser - with pagination', async () => {
      const apiResponse = await client.getListsForUser(blindborges, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('getAllListsForUser', async () => {
      for await (const response of client.getAllListsForUser(blindborges)) {
        expect('lists' in response).toBeTruthy()
      }
    })

    it('getLists', async () => {
      const apiResponse = await client.getLists()
      expect(t.exact(UserListsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getAllLists', async () => {
      for await (const response of client.getAllLists()) {
        expect('lists' in response).toBeTruthy()
      }
    })
  })

  describe('List', () => {
    it('getListItems', async () => {
      const listId = 962557
      const apiResponse = await client.getListItems(listId)
      expect(t.exact(UserListItemsResponseIO).is(apiResponse)).toBeTruthy()
    })
  })
})
