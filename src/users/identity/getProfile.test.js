import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const username = 'rodneyfool'

describe('Users - Identity - getProfileMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should get an user from its username', async () => {
    const data = await client.getProfile(username)
    data.should.be.an('object').and.have.property('username')
    data.username.should.be.equal(username)
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.getProfile(1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
