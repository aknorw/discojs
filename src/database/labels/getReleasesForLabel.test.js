import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const labelId = 108713

describe('Database - Labels - getReleasesForLabelMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should get releases for the label from its id', async () => {
    const data = await client.getReleasesForLabel(labelId)
    data.should.be.an('object').and.have.property('releases')
  })
  it('should return a TypeError if no param', () => {
    client.getReleasesForLabel().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `labelId` is not a number', () => {
    client.getReleasesForLabel('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should accept pagination', async () => {
    const page = 1
    const perPage = 3
    const data = await client.getReleasesForLabel(labelId, { page, perPage })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object')
    data.pagination.should.have.property('per_page')
    data.pagination.per_page.should.be.equal(perPage)
    data.pagination.should.have.property('page')
    data.pagination.page.should.be.equal(page)
  })
})
