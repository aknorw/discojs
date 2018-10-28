import paginate from '../../utils/paginate'
import sortBy from '../../utils/sort'

export const sortFields = ['year', 'title', 'format']

export default function getReleasesForArtist(artistId, pagination, sort) {
  if (typeof artistId !== 'number') {
    return Promise.reject(new TypeError(`[getReleasesForArtistMethod] artistId must be a number (${artistId})`))
  }
  return this._fetch({
    uri: `/artists/${artistId}/releases`,
    query: {
      ...paginate(pagination),
      ...sortBy(sort, sortFields),
    },
  })
}
