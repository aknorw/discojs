import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - Orders - getOrderMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should return a TypeError if `orderId` is not a number', () => {
    client.getOrder('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
