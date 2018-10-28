import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const artistId = 108713

describe('Database - Artists - getArtistMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should get an artist from its id', async () => {
    const data = await client.getArtist(artistId)
    data.should.be.an('object').and.have.property('id')
    data.id.should.be.equal(artistId)
  })
  it('should return a TypeError if `artistId` is not a number', () => {
    client.getArtist('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
