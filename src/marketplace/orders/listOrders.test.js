import chai from 'chai'

chai.should()

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - Orders - listOrdersMethod', () => {
  it('should return a TypeError if `status` is not supported by Discogs', () => {
    client.listOrders({ status: 'Test' }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
