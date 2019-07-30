import chai from 'chai'

chai.should()

const listId = 342829

describe('Lists - getItemsInListMethod', () => {
  it('should get list items from its id', async () => {
    const data = await client.getItemsInList(listId)
    data.should.be.an('object').and.have.property('items')
  })
  it('should return a TypeError if no param', () => {
    client.getItemsInList().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `listId` is not a number', () => {
    client.getItemsInList('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
