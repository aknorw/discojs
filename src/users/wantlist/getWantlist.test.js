import chai from 'chai'

chai.should()

const username = 'rodneyfool'

describe('Users - Wantlist - getWantlistMethod', () => {
  it('should return the list of releases in a user\'s wantlist', async () => {
    const data = await client.getWantlist(username)
    data.should.be.an('object').and.have.property('wants')
  })
  it('should return a TypeError if no param', () => {
    client.getWantlist().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.getWantlist(1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should accept pagination', async () => {
    const page = 1
    const perPage = 3
    const data = await client.getWantlist(username, { page, perPage })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object')
    data.pagination.should.have.property('per_page')
    data.pagination.per_page.should.be.equal(perPage)
    data.pagination.should.have.property('page')
    data.pagination.page.should.be.equal(page)
  })
})
