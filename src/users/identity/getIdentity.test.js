import chai from 'chai'

import Discojs from '../..'
import { AuthError } from '../../errors'

// eslint-disable-next-line no-unused-vars
const should = chai.should()

describe('Users - Identity - getIdentityMethod', () => {
  it('should get basic information about the authenticated user', async () => {
    const client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
    const data = await client.getIdentity()
    data.should.be.an('object').and.have.all.keys('id', 'username', 'resource_url', 'consumer_name')
  })
  it('should return an AuthError if not authenticated', () => {
    const client = new Discojs()
    client.getIdentity().catch(err => err.should.be.an.instanceOf(AuthError))
  })
})
