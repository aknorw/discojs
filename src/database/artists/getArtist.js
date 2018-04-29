export default function getArtist(artistId) {
  if (typeof artistId !== 'number') {
    return Promise.reject(new TypeError(`[getArtistMethod] artistId must be a number (${artistId})`))
  }
  return this._fetch({ uri: `/artists/${artistId}` })
}
