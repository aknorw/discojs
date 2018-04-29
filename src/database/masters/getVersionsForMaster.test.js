import chai from 'chai'

import Discojs from '../../'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const masterId = 96559

describe('Database - Masters - getVersionsForMasterMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should list releases that are versions of a master release from its id', async () => {
    const data = await client.getVersionsForMaster(masterId)
    data.should.be.an('object').and.have.property('versions')
  })
  it('should return a TypeError if no param', () => {
    client.getVersionsForMaster().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `masterId` is not a number', () => {
    client.getVersionsForMaster('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should accept pagination', async () => {
    const page = 1
    const perPage = 3
    const data = await client.getVersionsForMaster(masterId, { page, perPage })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object')
    data.pagination.should.have.property('per_page')
    data.pagination.per_page.should.be.equal(perPage)
    data.pagination.should.have.property('page')
    data.pagination.page.should.be.equal(page)
  })
})
