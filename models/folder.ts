import * as t from 'io-ts'

import { ResourceURLIO } from './commons'

/**
 * @internal
 */
export const FolderIO = t.intersection([
  ResourceURLIO,
  t.type({
    id: t.Integer,
    count: t.Integer,
    name: t.string,
  }),
])

/**
 * @internal
 */
const CustomFieldDropdownIO = t.type({
  type: t.literal('dropdown'),
  options: t.array(t.string),
})

/**
 * @internal
 */
const CustomFieldTextAreaIO = t.type({
  type: t.literal('textarea'),
  lines: t.Integer,
})

/**
 * @internal
 */
export const CustomFieldIO = t.intersection([
  t.union([CustomFieldDropdownIO, CustomFieldTextAreaIO]),
  t.type({
    id: t.Integer,
    name: t.string,
    position: t.Integer,
    public: t.boolean,
  }),
])

/**
 * @internal
 */
export const CollectionValueIO = t.type({
  maximum: t.string,
  median: t.string,
  minimum: t.string,
})

export type Folder = t.TypeOf<typeof FolderIO>
