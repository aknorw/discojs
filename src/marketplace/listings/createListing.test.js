import chai from 'chai'

chai.should()

const defaultOptions = {
  releaseId: 4652917,
  condition: {
    release: 'Poor (P)',
    sleeve: undefined,
  },
  price: 10000,
  status: 'Draft',
}

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - Listings - createListingMethod', () => {
  it('should return a TypeError if no param', () => {
    client.createListing().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `releaseId` is not a number', () => {
    client.createListing({ ...defaultOptions, releaseId: 'test' }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `condition.release` is not supported by Discogs', () => {
    client.createListing({ ...defaultOptions, condition: { release: 'Test' } })
      .catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `condition.sleeve` is not supported by Discogs', () => {
    client.createListing({ ...defaultOptions, condition: { release: 'Poor (P)', sleeve: 'Test' } })
      .catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `price` is not a number', () => {
    client.createListing({ ...defaultOptions, price: 'test' }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `comments` is not a string', () => {
    client.createListing({ ...defaultOptions, comments: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `allowOffers` is not a boolean', () => {
    client.createListing({ ...defaultOptions, allowOffers: 'test' })
      .catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `status` is not a `For Sale` or `Draft`', () => {
    client.createListing({ ...defaultOptions, status: 'test' }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `externalId` is not a string', () => {
    client.createListing({ ...defaultOptions, externalId: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `location` is not a string', () => {
    client.createListing({ ...defaultOptions, location: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `weight` is not a number or `auto`', () => {
    client.createListing({ ...defaultOptions, weight: 'heavy' }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `formatQty` is not a number or `auto`', () => {
    client.createListing({ ...defaultOptions, formatQty: 'a lot' }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
