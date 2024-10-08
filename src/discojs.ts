import { Database } from './database'
import { CurrenciesEnum, ReleaseConditionsEnum, SleeveConditionsEnum } from './enums'
import { InventoryExport } from './inventoryExport'
import { InventoryUpload } from './inventoryUpload'
import { MarketPlace } from './marketplace'
import { UserCollection } from './userCollection'
import { UserIdentity } from './userIdentity'
import { UserLists } from './userLists'
import { UserWantlist } from './userWantlist'
import { applyMixins, Blob, Fetcher, FetcherOptions, OutputFormat } from './utils'

type DiscojsOptions = FetcherOptions

export interface Discojs
  extends UserIdentity,
    UserCollection,
    UserWantlist,
    UserLists,
    Database,
    MarketPlace,
    InventoryExport,
    InventoryUpload {}

export class Discojs {
  protected fetcher: Fetcher

  public userAgent: string
  public outputFormat: OutputFormat

  constructor(options?: DiscojsOptions) {
    this.fetcher = new Fetcher(options ?? {})
    this.userAgent = this.fetcher.userAgent
    this.outputFormat = this.fetcher.outputFormat
  }

  /**
   * Return currencies supported by Discogs.
   *
   * @category Helpers
   *
   * @static
   */
  static getSupportedCurrencies() {
    return Object.values(CurrenciesEnum)
  }

  /**
   * Return release conditions supported by Discogs.
   *
   * @category Helpers
   *
   * @static
   */
  static getReleaseConditions() {
    return Object.values(ReleaseConditionsEnum)
  }

  /**
   * Return slevve conditions supported by Discogs.
   *
   * @category Helpers
   *
   * @static
   */
  static getSleeveConditions() {
    return Object.values(SleeveConditionsEnum)
  }

  /**
   * Retrieve an image retrieved in another response.
   *
   * @requires authentication
   *
   * @category Helpers
   *
   * @link https://www.discogs.com/developers#page:images
   */
  async fetchImage(imageUrl: string) {
    return this.fetcher.schedule<Blob>(imageUrl)
  }
}

applyMixins(Discojs, [
  UserIdentity,
  UserCollection,
  UserWantlist,
  UserLists,
  Database,
  MarketPlace,
  InventoryExport,
  InventoryUpload,
])
