import chai from 'chai'

chai.should()

describe('Users - Identity - getIdentityMethod', () => {
  it('should get basic information about the authenticated user', async () => {
    const data = await client.getIdentity()
    data.should.be.an('object').and.have.all.keys('id', 'username', 'resource_url', 'consumer_name')
  })
})
