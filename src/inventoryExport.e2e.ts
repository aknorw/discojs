import * as t from 'io-ts'

import { Discojs } from '.'
import { RecentExportsResponseIO } from '../models'
import { ExportItemIO } from '../models/inventory'

declare const client: Discojs

const pagination = { page: 1, perPage: 1 }

describe('Inventory Export', () => {
  let exportId: number

  describe('Export your inventory', () => {
    it('requestInventoryExport', async () => {
      const apiResponse = await client.requestInventoryExport()
      // Empty response has 0 keys
      expect(Object.keys(apiResponse).length).toEqual(0)
    })
  })

  describe('Get recent exports', () => {
    it('getRecentExports', async () => {
      const apiResponse = await client.getRecentExports()
      expect(t.exact(RecentExportsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getRecentExports - with pagination', async () => {
      const apiResponse = await client.getRecentExports(pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)

      // Set exportId for next tests.
      const { items } = apiResponse
      exportId = items[0].id
    })
  })

  describe('Get an export', () => {
    it('getExport', async () => {
      const apiResponse = await client.getExport(exportId)
      expect(t.exact(ExportItemIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Download an export', () => {
    it('downloadExport', async () => {
      const apiResponse = await client.downloadExport(exportId)
      expect(apiResponse.type).toEqual('text/csv; charset=utf-8')
    })
  })
})
