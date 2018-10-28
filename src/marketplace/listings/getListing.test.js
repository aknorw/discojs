import chai from 'chai'

import Discojs from '../..'
import { CURRENCIES } from '../../constants'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const listingId = 230025590

describe('Marketplace - Listings - getListingMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
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
