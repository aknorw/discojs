import chai from 'chai'

import Discojs from '..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const listId = 405348

describe('Lists - getItemsInListMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should get list items from its id', async () => {
    const data = await client.getItemsInList(listId)
    data.should.be.an('object').and.have.property('items')
  })
  it('should return a TypeError if no param', () => {
    client.getItemsInList().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `listId` is not a number', () => {
    client.getItemsInList('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
