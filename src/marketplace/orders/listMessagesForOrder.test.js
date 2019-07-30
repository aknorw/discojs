import chai from 'chai'

chai.should()

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - Orders - listMessagesForOrderMethod', () => {
  it('should return a TypeError if `orderId` is not a number', () => {
    client.listMessagesForOrder('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
