import chai from 'chai'

import { CURRENCIES } from '../../constants'

chai.should()

const listingId = 848131131

describe('Marketplace - Listings - getListingMethod', () => {
  it('should get a listing from its id', async () => {
    const data = await client.getListing(listingId)
    data.should.be.an('object').and.have.property('id')
    data.id.should.be.equal(listingId)
  })
  it('should return a TypeError if `listingId` is not a number', () => {
    client.getListing('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should accept currency param', async () => {
    const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)]
    const data = await client.getListing(listingId, currency)
    data.should.be.an('object').and.have.property('price')
    data.price.should.be.an('object').and.have.property('currency')
    data.price.currency.should.be.equal(currency)
  })
})
