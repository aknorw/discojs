import chai from 'chai'

chai.should()

const username = 'rodneyfool'

describe('Users - Collection - listFoldersForUserMethod', () => {
  it('should get folders in a user\'s collection from its username', async () => {
    const data = await client.listFoldersForUser(username)
    data.should.be.an('object').and.have.property('folders')
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.listFoldersForUser(1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
