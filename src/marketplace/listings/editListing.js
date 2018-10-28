import { RELEASE_CONDITIONS, SLEEVE_CONDITIONS, CURRENCIES } from '../../constants'

const listingStatus = ['For Sale', 'Draft']

export default function editListing(
  listingId,
  {
    releaseId,
    condition: { release, sleeve } = {},
    price,
    comments,
    allowOffers = false,
    status = listingStatus[0],
    externalId,
    location,
    weight = 'auto',
    formatQty = 'auto',
  } = {},
  currency,
) {
  if (typeof listingId !== 'number') {
    return Promise.reject(new TypeError(`[editListingMethod] listingId must be a number (${listingId})`))
  }
  const data = {}
  if (typeof releaseId === 'number') {
    data.release_id = releaseId
  } else {
    return Promise.reject(new TypeError(`[editListingMethod] releaseId must be a number (${releaseId})`))
  }
  if (RELEASE_CONDITIONS.includes(release)) {
    data.condition = release
  } else {
    return Promise.reject(
      new TypeError(
        `[editListingMethod] condition.release must be one of '${RELEASE_CONDITIONS.join(' / ')}' (${release})`,
      ),
    )
  }
  if (sleeve) {
    if (SLEEVE_CONDITIONS.includes(sleeve)) {
      data.sleeve_condition = sleeve
    } else {
      return Promise.reject(
        new TypeError(
          `[editListingMethod] condition.sleeve must be one of '${SLEEVE_CONDITIONS.join(' / ')}' (${sleeve})`,
        ),
      )
    }
  }
  if (typeof price === 'number') {
    data.price = price
  } else {
    return Promise.reject(new TypeError(`[editListingMethod] price must be a number (${price})`))
  }
  if (comments) {
    if (typeof comments === 'string') {
      data.comments = comments
    } else {
      return Promise.reject(new TypeError(`[editListingMethod] comments must be a string (${comments})`))
    }
  }
  if (typeof allowOffers === 'boolean') {
    data.allow_offers = allowOffers
  } else {
    return Promise.reject(new TypeError(`[editListingMethod] allowOffers must be a boolean (${allowOffers})`))
  }
  if (listingStatus.includes(status)) {
    data.status = status
  } else {
    return Promise.reject(
      new TypeError(`[editListingMethod] status must be one of '${listingStatus.join(' / ')}' (${status})`),
    )
  }
  if (externalId) {
    if (typeof externalId === 'string') {
      data.external_id = externalId
    } else {
      return Promise.reject(new TypeError(`[editListingMethod] externalId must be a string (${externalId})`))
    }
  }
  if (location) {
    if (typeof location === 'string') {
      data.location = location
    } else {
      return Promise.reject(new TypeError(`[editListingMethod] location must be a string (${location})`))
    }
  }
  if (typeof weight === 'number' || weight === 'auto') {
    data.weight = weight
  } else {
    return Promise.reject(new TypeError(`[editListingMethod] weight must be a number or 'auto' (${weight})`))
  }
  if (typeof formatQty === 'number' || formatQty === 'auto') {
    data.format_quantity = formatQty
  } else {
    return Promise.reject(new TypeError(`[editListingMethod] formatQty must be a number or 'auto' (${formatQty})`))
  }
  const query = {}
  if (currency && CURRENCIES.includes(currency)) {
    query.curr_abbr = currency
  }
  return this._fetch({
    uri: `/marketplace/listings/${listingId}`,
    query,
    options: {
      method: 'POST',
      data,
    },
  })
}
