import chai from 'chai'

chai.should()

const username = process.env.DGS_USERNAME
const folderName = `Folder${Math.random()}`
let folderId

describe('Users - Collection - removeFolderForUserMethod', () => {
  before(async () => {
    const { id } = await client.createFolderForUser(username, folderName)
    folderId = id
  })
  it('should remove a folder in a user\'s collection', async () => {
    const data = await client.removeFolderForUser(username, folderId)
    data.should.be.an('object').and.have.property('statusCode')
    data.statusCode.should.be.equal(204)
  })
  it('should return a TypeError if no param', () => {
    client.removeFolderForUser().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.removeFolderForUser(1337, folderId).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `folderId` is not a number', () => {
    client.removeFolderForUser(username, 'test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
