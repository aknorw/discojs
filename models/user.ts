import * as t from 'io-ts'

import { ResourceURLIO } from './commons'
import { makeEnumIOType } from './helpers'
import { CurrenciesEnum, SearchTypeEnum } from '../src/constants'

export const UserListIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    name: t.string,
    description: t.string,
    public: t.boolean,
    date_added: t.string,
    date_changed: t.string,
    uri: t.string,
  }),
])

export const UserListItemIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    type: makeEnumIOType(SearchTypeEnum),
    display_title: t.string,
    comment: t.string,
    uri: t.string,
    image_url: t.string,
  }),
])

export const IdentityIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    username: t.string,
    consumer_name: t.string,
  }),
])

export const UserIO = t.intersection([
  ResourceURLIO,
  t.partial({
    email: t.string,
    num_collection: t.Integer,
    num_wantlist: t.Integer,
  }),
  t.type({
    id: t.Integer,
    username: t.string,
    name: t.string,
    profile: t.string,
    home_page: t.string,
    location: t.string,
    registered: t.string,
    rank: t.Integer,
    uri: t.string,
    collection_fields_url: t.string,
    collection_folders_url: t.string,
    inventory_url: t.string,
    wantlist_url: t.string,
    rating_avg: t.number,
    releases_contributed: t.Integer,
    releases_rated: t.Integer,
    num_for_sale: t.Integer,
    num_lists: t.Integer,
    num_pending: t.Integer,
    buyer_rating: t.number,
    buyer_rating_stars: t.Integer,
    buyer_num_ratings: t.Integer,
    seller_rating: t.number,
    seller_rating_stars: t.Integer,
    seller_num_ratings: t.Integer,
    curr_abbr: makeEnumIOType(CurrenciesEnum),
  }),
])
