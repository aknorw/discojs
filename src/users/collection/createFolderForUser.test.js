import chai from 'chai'

import Discojs from '../..'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const username = process.env.DGS_USERNAME
const folderName = `Folder${Math.random()}`
let folderId

describe('Users - Collection - createCollectionFolderMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  after(() => {
    client.removeFolderForUser(username, folderId)
  })
  it('should create a new folder in a user\'s collection', async () => {
    const data = await client.createFolderForUser(username, folderName)
    data.should.be.an('object').and.have.all.keys('id', 'name', 'resource_url', 'count')
    data.name.should.be.equal(folderName)
    folderId = data.id
  })
  it('should return a TypeError if no param', () => {
    client.createFolderForUser().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.createFolderForUser(1337, folderName).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `name` is not a string', () => {
    client.createFolderForUser(username, 1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
