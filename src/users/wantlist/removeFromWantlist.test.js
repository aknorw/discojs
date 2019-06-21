import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const releaseId = 1189932

describe('Users - Wantlist - removeFromWantlistMethod', () => {
  before(async () => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
    await client.addToWantlist({
      username: process.env.DGS_USERNAME,
      releaseId,
    })
  })
  it('should remove a release from a user\'s wantlist', async () => {
    const data = await client.removeFromWantlist(process.env.DGS_USERNAME, releaseId)
    data.should.be.an('object').and.have.property('statusCode')
    data.statusCode.should.be.equal(204)
  })
  it('should return a TypeError if no param', () => {
    client.removeFromWantlist().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.removeFromWantlist(1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `id` is not a number', () => {
    client.removeFromWantlist(process.env.DGS_USERNAME, 'test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
