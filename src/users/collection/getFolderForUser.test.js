import chai from 'chai'

chai.should()

const username = 'rodneyfool'
const folderId = 0

describe('Users - Collection - getFolderForUserMethod', () => {
  it('should get folder in a user\'s collection from its username and a `folderId`', async () => {
    const data = await client.getFolderForUser(username, folderId)
    data.should.be.an('object').and.have.all.keys('id', 'name', 'resource_url', 'count')
    data.id.should.be.equal(folderId)
  })
  it('should return a TypeError if no param', () => {
    client.getFolderForUser().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.getFolderForUser(1337, folderId).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `folderId` is not a number', () => {
    client.getFolderForUser(username, 'test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
