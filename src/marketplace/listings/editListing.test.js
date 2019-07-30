import chai from 'chai'

chai.should()

const listingId = 172723812
const defaultOptions = {
  releaseId: 4652917,
  condition: {
    release: 'Poor (P)',
    sleeve: undefined,
  },
  price: 1000,
  status: 'Draft',
}

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - Listings - editListingMethod', () => {
  it('should return a TypeError if no param', () => {
    client.editListing().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `listingId` is not a number', () => {
    client.editListing('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `releaseId` is not a number', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      releaseId: 'test',
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `condition.release` is not supported by Discogs', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      condition: { release: 'Test' },
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `condition.sleeve` is not supported by Discogs', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      condition: { release: 'Poor (P)', sleeve: 'Test' },
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `price` is not a number', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      price: 'test',
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `comments` is not a string', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      comments: 1337,
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `allowOffers` is not a boolean', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      allowOffers: 'test',
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `status` is not a `For Sale` or `Draft`', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      status: 'test',
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `externalId` is not a string', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      externalId: 1337,
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `location` is not a string', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      location: 1337,
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `weight` is not a number or `auto`', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      weight: 'heavy',
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `formatQty` is not a number or `auto`', () => {
    client.editListing(listingId, {
      ...defaultOptions,
      formatQty: 'a lot',
    }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
