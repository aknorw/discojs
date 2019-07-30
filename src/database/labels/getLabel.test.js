import chai from 'chai'

chai.should()

const labelId = 1

describe('Database - Labels - getLabelMethod', () => {
  it('should get a label from its id', async () => {
    const data = await client.getLabel(labelId)
    data.should.be.an('object').and.have.property('id')
    data.id.should.be.equal(labelId)
  })
  it('should return a TypeError if `labelId` is not a number', () => {
    client.getLabel('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
