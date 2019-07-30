import chai from 'chai'

chai.should()

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - Listings - removeListingMethod', () => {
  it('should return a TypeError if no param', () => {
    client.removeListing().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if id is not a number', () => {
    client.removeListing('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
