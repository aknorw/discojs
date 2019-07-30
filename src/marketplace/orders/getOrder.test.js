import chai from 'chai'

chai.should()

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - Orders - getOrderMethod', () => {
  it('should return a TypeError if `orderId` is not a number', () => {
    client.getOrder('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
