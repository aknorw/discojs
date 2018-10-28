import { parse } from 'querystring'
import chai from 'chai'

import Discojs from '../..'
import { AuthError } from '../../errors'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const URL_REGEX = /^https:\/\/api\.discogs\.com\/.*\?(.*)$/

const query = 'test'

describe('Database - Releases - searchReleaseMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should search for a release from `query`', async () => {
    const data = await client.searchRelease(query)
    data.should.be.an('object').and.have.property('results')
  })
  it('should return a TypeError if no param', () => {
    client.searchRelease().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `query` is not a string', () => {
    client.searchRelease(1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for a release even if another type is requested', async () => {
    const data = await client.searchRelease(query, { type: 'label' })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).type.should.be.equal('release')
  })
  it('should accept pagination', async () => {
    const page = 1
    const perPage = 3
    const data = await client.searchRelease(query, {}, { page, perPage })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object')
    data.pagination.should.have.property('per_page')
    data.pagination.per_page.should.be.equal(perPage)
    data.pagination.should.have.property('page')
    data.pagination.page.should.be.equal(page)
  })
  it('should return an AuthError if not authenticated', () => {
    client = new Discojs()
    client.searchRelease(query).catch(err => err.should.be.an.instanceOf(AuthError))
  })
})
