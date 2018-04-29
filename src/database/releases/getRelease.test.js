import chai from 'chai'

import Discojs from '../../'
import { CURRENCIES } from '../../constants'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const releaseId = 249504

describe('Database - Releases - getReleaseMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should get a release from its id', async () => {
    const data = await client.getRelease(releaseId)
    data.should.be.an('object').and.have.property('id')
    data.id.should.be.equal(releaseId)
  })
  it('should return a TypeError if `releaseId` is not a number', () => {
    client.getRelease('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should accept currency param', async () => {
    const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)]
    const data = await client.getRelease(249504, currency)
    data.should.be.an('object')
    // @TODO: How to check ?
  })
})
