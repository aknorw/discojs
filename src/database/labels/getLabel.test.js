import chai from 'chai'

import Discojs from '../../'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

const labelId = 1

describe('Database - Labels - getLabelMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should get a label from its id', async () => {
    const data = await client.getLabel(labelId)
    data.should.be.an('object').and.have.property('id')
    data.id.should.be.equal(labelId)
  })
  it('should return a TypeError if `labelId` is not a number', () => {
    client.getLabel('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
