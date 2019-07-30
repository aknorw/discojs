import chai from 'chai'

chai.should()

const masterId = 96559

describe('Database - Masters - getMasterMethod', () => {
  it('should get a master release from its id', async () => {
    const data = await client.getMaster(masterId)
    data.should.be.an('object').and.have.property('id')
    data.id.should.be.equal(masterId)
  })
  it('should return a TypeError if `masterId` is not a number', () => {
    client.getMaster('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
