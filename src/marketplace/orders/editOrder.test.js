import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - Orders - editOrderMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should return a TypeError if no param', () => {
    client.editOrder().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `status` is not supported by Discogs', () => {
    const status = 'Test'
    client.editOrder(1337, { status }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `shipping` is not a number', () => {
    const shipping = 'Test'
    client.editOrder(1337, { shipping }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return an Error if no data', () => {
    client.editOrder(1337).catch(err => err.should.be.an.instanceOf(Error))
  })
})
