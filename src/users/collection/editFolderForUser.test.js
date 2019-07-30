import chai from 'chai'

chai.should()

const username = process.env.DGS_USERNAME
const folderName = `Folder${Math.random()}`
let folderId

describe('Users - Collection - editFolderForUserMethod', () => {
  before(async () => {
    const { id } = await client.createFolderForUser(username, folderName)
    folderId = id
  })
  after(() => {
    client.removeFolderForUser(username, folderId)
  })
  it('should edit a folder in a user\'s collection', async () => {
    const newFolderName = `NewFolder${Math.random()}`
    const data = await client.editFolderForUser(username, folderId, newFolderName)
    data.should.be.an('object').and.have.all.keys('id', 'name', 'resource_url', 'count')
    data.name.should.be.equal(newFolderName)
  })
  it('should return a TypeError if no param', () => {
    client.editFolderForUser().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.editFolderForUser(1337, folderId, folderName).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `folderId` is not a number', () => {
    client.editFolderForUser(username, 'test', folderId).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `name` is not a string', () => {
    client.editFolderForUser(username, folderId, 1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
