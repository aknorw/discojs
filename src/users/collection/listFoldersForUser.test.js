import chai from 'chai'

import Discojs from '../../'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const username = 'rodneyfool'

describe('Users - Collection - listFoldersForUserMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should get folders in a user\'s collection from its username', async () => {
    const data = await client.listFoldersForUser(username)
    data.should.be.an('object').and.have.property('folders')
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.listFoldersForUser(1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
