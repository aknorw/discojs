import * as t from 'io-ts'

import { ResourceURLIO } from './commons'

export const FolderIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    count: t.Integer,
    name: t.string,
  }),
])

const CustomFieldDropdownIO = t.type({
  type: t.literal('dropdown'),
  options: t.array(t.string),
})

const CustomFieldTextAreaIO = t.type({
  type: t.literal('textarea'),
  lines: t.Integer,
})

export const CustomFieldIO = t.intersection([
  t.union([CustomFieldDropdownIO, CustomFieldTextAreaIO]),
  t.type({
    id: t.Integer,
    name: t.string,
    position: t.Integer,
    public: t.boolean,
  }),
])

export const CollectionValueIO = t.type({
  maximum: t.string,
  median: t.string,
  minimum: t.string,
})

export interface Folder extends t.TypeOf<typeof FolderIO> {}
