import chai from 'chai'

chai.should()

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - getFeeMethod', () => {
  it('should return a TypeError if `price` is not a number', () => {
    client.getFee('100').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
