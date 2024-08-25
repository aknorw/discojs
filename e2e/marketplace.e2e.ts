import * as t from 'io-ts'

import { CurrenciesEnum, Discojs, InventorySortEnum, InventoryStatusesEnum, SortOrdersEnum } from '../lib'

import { InventoryResponseIO, MarketplaceStatisticsResponseIO, OrdersResponseIO } from '../models/api'
import { FeeIO, ListingIO } from '../models/marketplace'

declare const client: Discojs

const pagination = { page: 1, perPage: 1 }

describe('Marketplace', () => {
  describe('Inventory', () => {
    const username = 'Kozuch438'

    it('getInventoryForUser', async () => {
      const apiResponse = await client.getInventoryForUser(username)
      expect(t.exact(InventoryResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getInventoryForUser - with status', async () => {
      const apiResponse = await client.getInventoryForUser(username, InventoryStatusesEnum.FOR_SALE)
      expect(t.exact(InventoryResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getInventoryForUser - with sort', async () => {
      const by = InventorySortEnum.LISTED

      const firstApiResponse = await client.getInventoryForUser(username, undefined, { by, order: SortOrdersEnum.ASC })
      // Check if there are at least 2 listings.
      expect(firstApiResponse.listings.length).toBeGreaterThanOrEqual(2)
      const firstId = firstApiResponse.listings[0].id

      const secondApiResponse = await client.getInventoryForUser(username, undefined, {
        by,
        order: SortOrdersEnum.DESC,
      })
      const secondId = secondApiResponse.listings[0].id

      expect(firstId).not.toEqual(secondId)

      const apiResponse = await client.getInventoryForUser(username, undefined)

      expect(t.exact(InventoryResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getInventoryForUser - with pagination', async () => {
      const apiResponse = await client.getInventoryForUser(username, undefined, undefined, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('getAllInventoryForUser', async () => {
      // eslint-disable-next-line no-restricted-syntax
      for await (const response of client.getAllInventoryForUser(username)) {
        expect('listings' in response).toBeTruthy()
      }
    })

    it('getInventory', async () => {
      const apiResponse = await client.getInventory()
      expect(t.exact(InventoryResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getAllInventory', async () => {
      // eslint-disable-next-line no-restricted-syntax
      for await (const response of client.getAllInventory()) {
        expect('listings' in response).toBeTruthy()
      }
    })
  })

  describe('Listing', () => {
    it('getListing', async () => {
      const listingId = 7440
      const apiResponse = await client.getListing(listingId)
      expect(t.exact(ListingIO).is(apiResponse)).toBeTruthy()
    })

    it('getListing - with currency', async () => {
      const listingId = 7440
      const apiResponse = await client.getListing(listingId, CurrenciesEnum.SEK)
      expect(t.exact(ListingIO).is(apiResponse)).toBeTruthy()
    })

    // @TODO: Find a way to test editListing
    // @TODO: Find a way to test deleteListing
  })

  describe('New Listing', () => {
    // @TODO: Find a way to test createListing
  })

  describe('Order', () => {
    // @TODO: Find a way to test getOrder
    // @TODO: Find a way to test editOrder
  })

  describe('List Orders', () => {
    // @TODO: Add status, archived, sort, pagination
    it('listOrders', async () => {
      const apiResponse = await client.listOrders()
      expect(t.exact(OrdersResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('listAllOrders', async () => {
      // eslint-disable-next-line no-restricted-syntax
      for await (const response of client.listAllOrders()) {
        expect('orders' in response).toBeTruthy()
      }
    })
  })

  describe('Order Messages', () => {
    // @TODO: Find a way to test listOrderMessages
    // @TODO: Find a way to test sendOrderMessage
  })

  describe('Price suggestions', () => {
    // @TODO: Find a way to test getPriceSuggestions
  })

  describe('Statistics', () => {
    it('getMarketplaceStatistics', async () => {
      const releaseId = 7781525
      const apiResponse = await client.getMarketplaceStatistics(releaseId)
      expect(t.exact(MarketplaceStatisticsResponseIO).is(apiResponse)).toBeTruthy()
    })
  })
})
