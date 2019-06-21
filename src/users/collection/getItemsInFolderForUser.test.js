import { parse } from 'querystring'
import chai from 'chai'

import Discojs from '../..'
import { sortFields } from './getItemsInFolderForUser'
import { sortOrders } from '../../utils/sort'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const URL_REGEX = /^https:\/\/api\.discogs\.com\/.*\?(.*)$/

const username = 'rodneyfool'
const folderId = 0

describe('Users - Collection - getItemsInFolderForUser', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })

  it('should get items in a folder in a user\'s collection from its username and a `folderId`', async () => {
    const data = await client.getItemsInFolderForUser(username, folderId)
    data.should.be.an('object').and.have.property('releases')
  })
  
  it('should return a TypeError if no param', () => {
    client.getItemsInFolderForUser().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.getItemsInFolderForUser(1337, folderId).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `folderId` is not a number', () => {
    client.getItemsInFolderForUser(username, 'test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should accept sort', async () => {
    const by = sortFields[Math.floor(Math.random() * sortFields.length)]
    const order = sortOrders[Math.floor(Math.random() * sortOrders.length)]
    const data = await client.getItemsInFolderForUser(username, folderId, {}, { by, order })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    const { sort, sort_order } = parse(URL_REGEX.exec(data.pagination.urls.last)[1]) // eslint-disable-line camelcase
    sort.should.be.equal(by)
    sort_order.should.be.equal(order)
  })
  it('should accept pagination', async () => {
    const page = 1
    const perPage = 3
    const data = await client.getItemsInFolderForUser(username, folderId, { page, perPage })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object')
    data.pagination.should.have.property('per_page')
    data.pagination.per_page.should.be.equal(perPage)
    data.pagination.should.have.property('page')
    data.pagination.page.should.be.equal(page)
  })
})
