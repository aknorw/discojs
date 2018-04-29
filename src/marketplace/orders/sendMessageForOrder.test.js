import chai from 'chai'

import Discojs from '../../'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - Orders - sendMessageForOrderMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should return a TypeError if no param', () => {
    client.sendMessageForOrder().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `orderId` is not a number', () => {
    client.sendMessageForOrder('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return an Error if no data', () => {
    client.sendMessageForOrder(1337).catch(err => err.should.be.an.instanceOf(Error))
  })
  it('should return a TypeError if `message` is not a string', () => {
    client.sendMessageForOrder(1337, { message: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `status` is not supported by Discogs', () => {
    client.sendMessageForOrder(1337, { status: 'Test' }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
