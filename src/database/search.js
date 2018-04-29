import paginate from '../utils/paginate'

const typeFields = [
  'release',
  'master',
  'artist',
  'label',
]

export default function searchDatabase({
  query,
  type,
  title,
  releaseTitle,
  credit,
  artist,
  anv,
  label,
  genre,
  style,
  country,
  year,
  format,
  catno,
  barcode,
  track,
  submitter,
  contributor,
} = {}, paginationOpt = {}) {
  const opt = {}
  if (query) {
    if (typeof query === 'string') {
      opt.q = query
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] query must be a string (${query})`))
    }
  }
  if (type) {
    if (typeFields.includes(type)) {
      opt.type = type
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] type must be one of '${typeFields.join(' / ')}' (${type})`))
    }
  }
  if (title) {
    if (typeof title === 'string') {
      opt.title = title
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] title must be a string (${title})`))
    }
  }
  if (releaseTitle) {
    if (typeof releaseTitle === 'string') {
      opt.release_title = releaseTitle
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] releaseTitle must be a string (${releaseTitle})`))
    }
  }
  if (credit) {
    if (typeof credit === 'string') {
      opt.credit = credit
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] credit must be a string (${credit})`))
    }
  }
  if (artist) {
    if (typeof artist === 'string') {
      opt.artist = artist
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] artist must be a string (${artist})`))
    }
  }
  if (anv) {
    if (typeof anv === 'string') {
      opt.anv = anv
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] anv must be a string (${anv})`))
    }
  }
  if (label) {
    if (typeof label === 'string') {
      opt.label = label
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] label must be a string (${label})`))
    }
  }
  if (genre) {
    if (typeof genre === 'string') {
      opt.genre = genre
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] genre must be a string (${genre})`))
    }
  }
  if (style) {
    if (typeof style === 'string') {
      opt.style = style
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] style must be a string (${style})`))
    }
  }
  if (country) {
    if (typeof country === 'string') {
      opt.country = country
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] country must be a string (${country})`))
    }
  }
  if (year) {
    if (typeof year === 'string' || typeof year === 'number') {
      opt.year = year
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] year must be a string or a number (${year})`))
    }
  }
  if (format) {
    if (typeof format === 'string') {
      opt.format = format
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] format must be a string (${format})`))
    }
  }
  if (catno) {
    if (typeof catno === 'string') {
      opt.catno = catno
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] catno must be a string (${catno})`))
    }
  }
  if (barcode) {
    if (typeof barcode === 'string') {
      opt.barcode = barcode
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] barcode must be a string (${barcode})`))
    }
  }
  if (track) {
    if (typeof track === 'string') {
      opt.track = track
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] track must be a string (${track})`))
    }
  }
  if (submitter) {
    if (typeof submitter === 'string') {
      opt.submitter = submitter
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] submitter must be a string (${submitter})`))
    }
  }
  if (contributor) {
    if (typeof contributor === 'string') {
      opt.contributor = contributor
    } else {
      return Promise.reject(new TypeError(`[searchDatabaseMethod] contributor must be a string (${contributor})`))
    }
  }
  return this._fetch({
    uri: '/database/search',
    query: {
      ...opt,
      ...paginate(paginationOpt),
    },
  })
}
