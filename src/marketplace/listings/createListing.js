import { RELEASE_CONDITIONS, SLEEVE_CONDITIONS } from '../../constants'

const listingStatus = [
  'For Sale',
  'Draft',
]

export default function createListing({
  releaseId,
  condition: {
    release,
    sleeve,
  } = {},
  price,
  comments,
  allowOffers = false,
  status = listingStatus[0],
  externalId,
  location,
  weight = 'auto',
  formatQty = 'auto',
} = {}) {
  const data = {}
  if (typeof releaseId === 'number') {
    data.release_id = releaseId
  } else {
    return Promise.reject(new TypeError(`[createListingMethod] releaseId must be a number (${releaseId})`))
  }
  if (RELEASE_CONDITIONS.includes(release)) {
    data.condition = release
  } else {
    return Promise.reject(new TypeError(`[createListingMethod] condition.release must be one of '${RELEASE_CONDITIONS.join(' / ')}' (${release})`))
  }
  if (sleeve) {
    if (SLEEVE_CONDITIONS.includes(sleeve)) {
      data.sleeve_condition = sleeve
    } else {
      return Promise.reject(new TypeError(`[createListingMethod] condition.sleeve must be one of '${SLEEVE_CONDITIONS.join(' / ')}' (${sleeve})`))
    }
  }
  if (typeof price === 'number') {
    data.price = price
  } else {
    return Promise.reject(new TypeError(`[createListingMethod] price must be a number (${price})`))
  }
  if (comments) {
    if (typeof comments === 'string') {
      data.comments = comments
    } else {
      return Promise.reject(new TypeError(`[createListingMethod] comments must be a string (${comments})`))
    }
  }
  if (typeof allowOffers === 'boolean') {
    data.allow_offers = allowOffers
  } else {
    return Promise.reject(new TypeError(`[createListingMethod] allowOffers must be a boolean (${allowOffers})`))
  }
  if (listingStatus.includes(status)) {
    data.status = status
  } else {
    return Promise.reject(new TypeError(`[createListingMethod] status must be one of '${listingStatus.join(' / ')}' (${status})`))
  }
  if (externalId) {
    if (typeof externalId === 'string') {
      data.external_id = externalId
    } else {
      return Promise.reject(new TypeError(`[createListingMethod] externalId must be a string (${externalId})`))
    }
  }
  if (location) {
    if (typeof location === 'string') {
      data.location = location
    } else {
      return Promise.reject(new TypeError(`[createListingMethod] location must be a string (${location})`))
    }
  }
  if (typeof weight === 'number' || weight === 'auto') {
    data.weight = weight
  } else {
    return Promise.reject(new TypeError(`[createListingMethod] weight must be a number or 'auto' (${weight})`))
  }
  if (typeof formatQty === 'number' || formatQty === 'auto') {
    data.format_quantity = formatQty
  } else {
    return Promise.reject(new TypeError(`[createListingMethod] formatQty must be a number or 'auto' (${formatQty})`))
  }
  return this._fetch({
    uri: '/marketplace/listings',
    options: {
      method: 'POST',
      data,
    },
  })
}
