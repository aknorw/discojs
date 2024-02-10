import * as t from 'io-ts'

/**
 * @internal
 */
export const ExportItemIO = t.type({
  id: t.Integer,
  filename: t.string,
  status: t.string,
  download_url: t.string,
  url: t.string,
  created_ts: t.string,
  finished_ts: t.string,
})
export type ExportItem = t.TypeOf<typeof ExportItemIO>
