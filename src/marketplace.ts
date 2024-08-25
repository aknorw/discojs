import {
  CreateListingResponse,
  EmptyResponse,
  InventoryResponse,
  Listing,
  MarketplaceStatisticsResponse,
  Order,
  OrderMessage,
  OrderMessagesResponse,
  OrdersResponse,
  PriceSuggestionsResponse,
} from '../models'
import type { Discojs } from './discojs'
import {
  CurrenciesEnum,
  EditOrderStatusesEnum,
  InventorySortEnum,
  InventoryStatusesEnum,
  ListingStatusesEnum,
  OrderSortEnum,
  OrderStatusesEnum,
  ReleaseConditionsEnum,
  SleeveConditionsEnum,
} from './enums'
import { HTTPVerbsEnum, paginate, Pagination, sortBy, SortOptions } from './utils'

type ListingOptions = {
  releaseId: number
  condition: ReleaseConditionsEnum
  sleeveCondition?: SleeveConditionsEnum
  price: number
  comments?: string
  allowOffers?: boolean
  status: ListingStatusesEnum
  externalId?: string
  location?: string
  weight?: 'auto' | number
  formatQuantity?: 'auto' | number
}

export class MarketPlace {
  /**
   * Get a seller’s inventory.
   *
   * @remarks
   * If you are not authenticated as the inventory owner, only items that have a status of For Sale will be visible.
   * If you are authenticated as the inventory owner you will get additional weight, format_quantity, external_id, and location keys.
   * If the user is authorized, the listing will contain a `in_cart` boolean field indicating whether or not this listing is in their cart.
   *
   * @category Marketplace
   * @label Inventory
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-inventory
   */
  async getInventoryForUser(
    this: Discojs,
    username: string,
    status: InventoryStatusesEnum = InventoryStatusesEnum.ALL,
    sort?: SortOptions<InventorySortEnum>,
    pagination?: Pagination,
  ) {
    return this.fetcher.schedule<InventoryResponse>(`/users/${username}/inventory`, {
      status,
      ...sortBy(InventorySortEnum.LISTED, sort),
      ...paginate(pagination),
    })
  }

  /**
   * Get all seller’s inventory.
   *
   * @category Marketplace
   * @label Inventory
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-inventory
   */
  getAllInventoryForUser(
    this: Discojs,
    username: string,
    status: InventoryStatusesEnum = InventoryStatusesEnum.ALL,
    sort?: SortOptions<InventorySortEnum>,
  ) {
    return this.fetcher.createAllMethod((pagination) => this.getInventoryForUser(username, status, sort, pagination))
  }

  /**
   * Get authenticated user’s inventory.
   *
   * @category Marketplace
   * @label Inventory
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-inventory
   */
  async getInventory(
    this: Discojs,
    status?: InventoryStatusesEnum,
    sort?: SortOptions<InventorySortEnum>,
    pagination?: Pagination,
  ) {
    const username = await this.getUsername()
    return this.getInventoryForUser(username, status, sort, pagination)
  }

  /**
   * Get all authenticated user’s inventory.
   *
   * @category Marketplace
   * @label Inventory
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-inventory
   */
  getAllInventory(this: Discojs, status?: InventoryStatusesEnum, sort?: SortOptions<InventorySortEnum>) {
    return this.fetcher.createAllMethod((pagination) => this.getInventory(status, sort, pagination))
  }

  /**
   * View the data associated with a listing.
   *
   * @remarks
   * If the authorized user is the listing owner the listing will include the weight, format_quantity, external_id, and location keys.
   * If the user is authorized, the listing will contain a in_cart boolean field indicating whether or not this listing is in their cart.
   *
   * @category Marketplace
   * @label Listing
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-listing
   */
  async getListing(this: Discojs, listingId: number, currency?: CurrenciesEnum) {
    return this.fetcher.schedule<Listing>(`/marketplace/listings/${listingId}`, { currency })
  }

  /**
   * Edit the data associated with a listing.
   *
   * @remarks
   * If the listing’s status is not For Sale, Draft, or Expired, it cannot be modified – only deleted.
   *
   * @category Marketplace
   * @label Listing
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-listing
   */
  async editListing(this: Discojs, listingId: number, options: ListingOptions, currency?: CurrenciesEnum) {
    return this.fetcher.schedule<EmptyResponse>(
      `/marketplace/listings/${listingId}`,
      { currency },
      HTTPVerbsEnum.POST,
      options,
    )
  }

  /**
   * Permanently remove a listing from the Marketplace.
   *
   * @category Marketplace
   * @label Listing
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-listing
   */
  async deleteListing(this: Discojs, listingId: number) {
    return this.fetcher.schedule<EmptyResponse>(`/marketplace/listings/${listingId}`, {}, HTTPVerbsEnum.DELETE)
  }

  /**
   * Create a Marketplace listing.
   *
   * @category Marketplace
   * @label New Listing
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-new-listing
   */
  async createListing(this: Discojs, options: ListingOptions) {
    return this.fetcher.schedule<CreateListingResponse>('/marketplace/listings/', {}, HTTPVerbsEnum.POST, options)
  }

  /**
   * View the data associated with an order.
   *
   * @category Marketplace
   * @label Order
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-order
   */
  async getOrder(this: Discojs, orderId: number) {
    return this.fetcher.schedule<Order>(`/marketplace/orders/${orderId}`)
  }

  /**
   * Edit the data associated with an order.
   *
   * @category Marketplace
   * @label Order
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-order
   */
  async editOrder(this: Discojs, orderId: number, status?: EditOrderStatusesEnum, shipping?: number) {
    return this.fetcher.schedule<Order>(`/marketplace/orders/${orderId}`, {}, HTTPVerbsEnum.POST, { status, shipping })
  }

  /**
   * Returns a list of the authenticated user’s orders.
   *
   * @category Marketplace
   * @label List Orders
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-list-orders
   */
  async listOrders(
    this: Discojs,
    status?: OrderStatusesEnum,
    archived?: boolean,
    sort?: SortOptions<OrderSortEnum>,
    pagination?: Pagination,
  ) {
    return this.fetcher.schedule<OrdersResponse>('/marketplace/orders', {
      status,
      archived,
      ...sortBy(OrderSortEnum.ID, sort),
      ...paginate(pagination),
    })
  }

  /**
   * Returns all authenticated user’s orders.
   *
   * @category Marketplace
   * @label List Orders
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-list-orders
   */
  listAllOrders(this: Discojs, status?: OrderStatusesEnum, archived?: boolean, sort?: SortOptions<OrderSortEnum>) {
    return this.fetcher.createAllMethod((pagination) => this.listOrders(status, archived, sort, pagination))
  }

  /**
   * Returns a list of the order’s messages with the most recent first.
   *
   * @category Marketplace
   * @label Order Messages
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-list-order-messages
   */
  async listOrderMessages(this: Discojs, orderId: number) {
    return this.fetcher.schedule<OrderMessagesResponse>(`/marketplace/orders/${orderId}/messages`)
  }

  /**
   * Adds a new message to the order’s message log.
   *
   * @remarks
   * When posting a new message, you can simultaneously change the order status.
   * If you do, the message will automatically be prepended with: "Seller changed status from `Old Status` to `New Status`"
   * While message and status are each optional, one or both must be present.
   *
   * @category Marketplace
   * @label Order Messages
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-list-order-messages
   */
  async sendOrderMessage(this: Discojs, orderId: number, message?: string, status?: OrderStatusesEnum) {
    return this.fetcher.schedule<OrderMessage>(`/marketplace/orders/${orderId}/messages`, {}, HTTPVerbsEnum.POST, {
      message,
      status,
    })
  }

  /**
   * The Fee resource allows you to quickly calculate the fee for selling an item on the Marketplace.
   *
   * @category Marketplace
   * @label Fee
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-fee
   *
   * Note: This endpoint is broken.
   */
  // async getFee(this: Discojs, price: number, currency?: CurrenciesEnum) {
  //   let uri = `/marketplace/fee/${price}`
  //   if (currency) uri += `/${currency}`

  //   return this.fetcher.schedule<Fee>(uri)
  // }

  /**
   * Retrieve price suggestions for the provided Release ID.
   *
   * @remarks
   * Suggested prices will be denominated in the user’s selling currency.
   *
   * @category Marketplace
   * @label Price Suggestions
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-price-suggestions
   */
  async getPriceSuggestions(this: Discojs, releaseId: number) {
    return this.fetcher.schedule<PriceSuggestionsResponse>(`/marketplace/price_suggestions/${releaseId}`)
  }

  /**
   * Retrieve marketplace statistics for the provided Release ID.
   *
   * @remarks
   * These statistics reflect the state of the release in the marketplace currently, and include the number of items currently for sale,
   * lowest listed price of any item for sale, and whether the item is blocked for sale in the marketplace.
   *
   *
   * @category Marketplace
   * @label Release Statistics
   *
   * @link https://www.discogs.com/developers#page:marketplace,header:marketplace-release-statistics
   */
  async getMarketplaceStatistics(this: Discojs, releaseId: number, currency?: CurrenciesEnum) {
    return this.fetcher.schedule<MarketplaceStatisticsResponse>(`/marketplace/stats/${releaseId}`, { currency })
  }
}
