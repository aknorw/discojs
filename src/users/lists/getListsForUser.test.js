import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const username = process.env.DGS_USERNAME

describe('Users - Lists - getListsMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should get user\'s lists from its username', async () => {
    const data = await client.getListsForUser(username)
    data.should.be.an('object').and.have.property('lists')
  })
  it('should return a TypeError if no param', () => {
    client.getListsForUser().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.getListsForUser(1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should accept pagination', async () => {
    const page = 1
    const perPage = 1
    const data = await client.getListsForUser(username, { page, perPage })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object')
    data.pagination.should.have.property('per_page')
    data.pagination.per_page.should.be.equal(perPage)
    data.pagination.should.have.property('page')
    data.pagination.page.should.be.equal(page)
  })
})
