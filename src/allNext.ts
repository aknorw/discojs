import { IPaginated } from '../models/api'
import type { Discojs } from './discojs'

export class AllNext {
  /**
   * @internal
   *
   * Gets the next page of a paginated result
   */
  next<TResponse extends IPaginated>(this: Discojs, response: TResponse) {
    const { next } = response.pagination.urls
    if (next === undefined) {
      return Promise.resolve(undefined)
    }
    return this.fetcher.schedule<TResponse>(next)
  }

  /**
   * Retrieve all resources from a paginated endpoint.
   * @param this
   * @param key the name of the field in `TResponse` you wish to aggregate
   * @param response the starting page for the paginated response
   * @param onProgress optional callback to invoke as each page is retrieved
   * @typeparam TKey the name of the field in `TResponse` you wish to aggregate (inferred from `key`)
   * @typeparam TResultElement the type of record (inferred from `key` and `response`)
   * @typeparam TResponse the type of the response (inferred from `response`)
   * @returns an array containing all elements from the different pages concatenated together
   */
  async all<TKey extends string, TResultElement, TResponse extends IPaginated & { [K in TKey]: TResultElement[] }>(
    this: Discojs,
    key: TKey,
    response: TResponse | undefined,
    onProgress?: (data: TResultElement[]) => void,
  ) {
    let result: TResultElement[] = []
    while (response !== undefined) {
      const data = response[key]
      onProgress?.(data)
      result = result.concat(data)
      // eslint-disable-next-line no-await-in-loop, no-param-reassign
      response = await this.next(response)
      if (response === undefined) {
        break
      }
    }
    return result
  }
}
