import chai from 'chai'

chai.should()

const artistId = 108713

describe('Database - Artists - getArtistMethod', () => {
  it('should get an artist from its id', async () => {
    const data = await client.getArtist(artistId)
    data.should.be.an('object').and.have.property('id')
    data.id.should.be.equal(artistId)
  })
  it('should return a TypeError if `artistId` is not a number', () => {
    client.getArtist('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
