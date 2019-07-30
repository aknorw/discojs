import { parse } from 'querystring'
import chai from 'chai'

import { sortFields } from './getReleasesForArtist'
import { sortOrders } from '../../utils/sort'

chai.should()

const URL_REGEX = /^https:\/\/api\.discogs\.com\/.*\?(.*)$/

const artistId = 108713

describe('Database - Artists - getReleasesForArtistMethod', () => {
  it('should get releases for an artist from its id', async () => {
    const data = await client.getReleasesForArtist(artistId)
    data.should.be.an('object').and.have.property('releases')
  })
  it('should return a TypeError if no param', () => {
    client.getReleasesForArtist().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `artistId` is not a number', () => {
    client.getReleasesForArtist('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should accept pagination', async () => {
    const page = 1
    const perPage = 3
    const data = await client.getReleasesForArtist(artistId, { page, perPage })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object')
    data.pagination.should.have.property('per_page')
    data.pagination.per_page.should.be.equal(perPage)
    data.pagination.should.have.property('page')
    data.pagination.page.should.be.equal(page)
  })
  it('should accept sort', async () => {
    const by = sortFields[Math.floor(Math.random() * sortFields.length)]
    const order = sortOrders[Math.floor(Math.random() * sortOrders.length)]
    const data = await client.getReleasesForArtist(artistId, {}, { by, order })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    const { sort, sort_order } = parse(URL_REGEX.exec(data.pagination.urls.last)[1]) // eslint-disable-line camelcase
    sort.should.be.equal(by)
    sort_order.should.be.equal(order)
  })
})
