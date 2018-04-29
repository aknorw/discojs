import chai from 'chai'

import Discojs from '../../'
import { CURRENCIES } from '../../constants'

// eslint-disable-next-line no-unused-vars
const should = chai.should()
let client

describe('Users - Identity - editProfileMethod', () => {
  before(() => {
    client = new Discojs({
      userToken: process.env.USER_TOKEN,
      requestLimitAuth: 20,
    })
  })
  it('should return a TypeError if no param', () => {
    client.editProfile().catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return a TypeError if `username` is not a string', () => {
    client.editProfile(1337).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should return an Error if no data', () => {
    client.editProfile(process.env.DGS_USERNAME).catch(err => err.should.be.an.instanceOf(Error))
  })
  it('should edit `name`', async () => {
    const name = `Test${Math.floor(100 * Math.random())}`
    const data = await client.editProfile(process.env.DGS_USERNAME, { name })
    data.should.be.an('object').and.have.property('name')
    data.name.should.be.equal(name)
  })
  it('should return a TypeError if `name` is not a string', () => {
    const name = 1337
    client.editProfile(process.env.DGS_USERNAME, { name }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should edit `homepage`', async () => {
    const homepage = `http://discogs.com/${Math.floor(100 * Math.random())}`
    const data = await client.editProfile(process.env.DGS_USERNAME, { homepage })
    data.should.be.an('object').and.have.property('home_page')
    data.home_page.should.be.equal(homepage)
  })
  it('should return a TypeError if `homepage` is not a string', () => {
    const homepage = 1337
    client.editProfile(process.env.DGS_USERNAME, { homepage }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should edit `location`', async () => {
    const location = `${Math.floor(10 * Math.random())}°N`
    const data = await client.editProfile(process.env.DGS_USERNAME, { location })
    data.should.be.an('object').and.have.property('location')
    data.location.should.be.equal(location)
  })
  it('should return a TypeError if `location` is not a string', () => {
    const location = 1337
    client.editProfile(process.env.DGS_USERNAME, { location }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should edit `profile`', async () => {
    const profile = `${Math.floor(10 * Math.random())} ${Math.floor(10 * Math.random())}`
    const data = await client.editProfile(process.env.DGS_USERNAME, { profile })
    data.should.be.an('object').and.have.property('profile')
    data.profile.should.be.equal(profile)
  })
  it('should return a TypeError if `profile` is not a string', () => {
    const profile = 1337
    client.editProfile(process.env.DGS_USERNAME, { profile }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should edit `currAbbr`', async () => {
    const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)]
    const data = await client.editProfile(process.env.DGS_USERNAME, { currency })
    data.should.be.an('object').and.have.property('curr_abbr')
    data.curr_abbr.should.be.equal(currency)
  })
  it('should return a TypeError if `currAbbr` is not supported by Discogs', () => {
    const currency = 'FCFA'
    client.editProfile(process.env.DGS_USERNAME, { currency }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
