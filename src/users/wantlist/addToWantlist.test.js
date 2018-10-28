import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

describe('Users - Wantlist - addToWantlistMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should add a release to a user\'s wantlist', async () => {
    const releaseId = 1189932
    const notes = `Notes: ${Math.floor(10 * Math.random())}`
    const rating = Math.floor(5 * Math.random()) + 1
    const data = await client.addToWantlist({
      username: process.env.DGS_USERNAME,
      releaseId,
      notes,
      rating,
    })
    data.should.be.an('object').and.have.property('basic_information')
    data.basic_information.should.be.an('object').and.have.property('id')
    data.basic_information.id.should.be.equal(releaseId)
    data.should.have.property('notes')
    data.notes.should.be.equal(notes)
    data.should.have.property('rating')
    data.rating.should.be.equal(rating)
  })
  it('should return a TypeError if no param', () => {
    client.addToWantlist().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.addToWantlist({ username: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `releaseId` is not a number', () => {
    client.addToWantlist({ username: process.env.DGS_USERNAME, releaseId: 'test' })
      .catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `notes` is not a string', () => {
    client.addToWantlist({ username: process.env.DGS_USERNAME, releaseId: 1337, notes: 1337 })
      .catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `rating` is not a number', () => {
    client.addToWantlist({ username: process.env.DGS_USERNAME, releaseId: 1337, rating: 'test' })
      .catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
