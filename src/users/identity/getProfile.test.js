import chai from 'chai'

chai.should()

const username = 'rodneyfool'

describe('Users - Identity - getProfileMethod', () => {
  it('should get an user from its username', async () => {
    const data = await client.getProfile(username)
    data.should.be.an('object').and.have.property('username')
    data.username.should.be.equal(username)
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.getProfile(1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
