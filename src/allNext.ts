import { IPaginated } from "../models/api"
import type { Discojs } from './discojs'

export class AllNext {
  next<TResponse extends IPaginated>(this: Discojs, response: TResponse) {
    const { next } = response.pagination.urls
    if (next === undefined) {
      return Promise.resolve(undefined)
    }
    return this.fetcher.schedule<TResponse>(next)
  }

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