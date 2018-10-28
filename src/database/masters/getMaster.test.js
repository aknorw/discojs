import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const masterId = 96559

describe('Database - Masters - getMasterMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should get a master release from its id', async () => {
    const data = await client.getMaster(masterId)
    data.should.be.an('object').and.have.property('id')
    data.id.should.be.equal(masterId)
  })
  it('should return a TypeError if `masterId` is not a number', () => {
    client.getMaster('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
