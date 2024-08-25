import { EmptyResponse, RecentExportsResponse } from '../models'
import { ExportItem } from '../models/inventory'

import { Discojs } from './discojs'
import { HTTPVerbsEnum, paginate, Pagination } from './utils'

export class InventoryExport {
  /**
   * Request an export of your inventory as a CSV.
   *
   * @category Inventory Export
   * @label Export your inventory
   *
   * @link https://www.discogs.com/developers#page:inventory-export,header:inventory-export-export-your-inventory
   */
  async requestInventoryExport(this: Discojs) {
    return this.fetcher.schedule<EmptyResponse>('/inventory/export', undefined, HTTPVerbsEnum.POST)
  }

  /**
   * Get a list of all recent exports of your inventory.
   *
   * @category Inventory Export
   * @label Get recent exports
   *
   * @link https://www.discogs.com/developers#page:inventory-export,header:inventory-export-get-recent-exports
   */
  async getRecentExports(this: Discojs, pagination?: Pagination) {
    return this.fetcher.schedule<RecentExportsResponse>('/inventory/export', paginate(pagination))
  }

  getAllRecentExports(this: Discojs) {
    return this.fetcher.createAllMethod((pagination) => this.getRecentExports(pagination))
  }

  /**
   * Get details about the status of an inventory export.
   *
   * @category Inventory Export
   * @label Get an export
   *
   * @link https://www.discogs.com/developers#page:inventory-export,header:inventory-export-get-an-export
   */
  async getExport(this: Discojs, exportId: number) {
    return this.fetcher.schedule<ExportItem>(`/inventory/export/${exportId}`)
  }

  /**
   * Download the results of an inventory export.
   *
   * @category Inventory Export
   * @label Download an export
   *
   * @link https://www.discogs.com/developers#page:inventory-export,header:inventory-export-download-an-export
   */
  async downloadExport(this: Discojs, exportId: number) {
    return this.fetcher.schedule<Blob>(`/inventory/export/${exportId}/download`)
  }
}
