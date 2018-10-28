import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const username = process.env.DGS_USERNAME

describe('Users - Collection - getValueMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should get custom fields of a user\'s collection from its username', async () => {
    const data = await client.getValue(username)
    data.should.be.an('object').and.have.all.keys('maximum', 'median', 'minimum')
  })
  it('should return a TypeError if no param', () => {
    client.getValue().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.getValue(1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
