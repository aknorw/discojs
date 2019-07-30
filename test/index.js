import chai from 'chai'

import Discojs from '../src'
import { CURRENCIES, RELEASE_CONDITIONS, SLEEVE_CONDITIONS } from '../src/constants'

import { version } from '../package.json'

chai.should()

const userAgent = `Discojs/Test/${version}`
const userToken = '7h1515myu53r70k3n'
const consumerKey = 'c0n5um3rk3y'
const consumerSecret = 'w0w7h1515r34lly53cr37'

describe('Constructor', () => {
  it('should create an instance without custom parameters', () => {
    const dummyClient = new Discojs()
    dummyClient.should.be.an.instanceOf(Discojs)
    dummyClient.should.have.property('userAgent')
    dummyClient.should.have.property('outputFormat')
    dummyClient.should.have.property('fetchOptions')
  })
  context('Authentication', () => {
    it('should not have an `auth` property if no authentication', () => {
      new Discojs().should.not.have.property('auth')
    })
    context('userToken', () => {
      it('should have an `auth` property with custom `userToken`', () => {
        const dummyClient = new Discojs({ userToken })
        dummyClient.should.have.property('auth')
        dummyClient.auth.should.have.all.keys('level', 'userToken')
        dummyClient.auth.level.should.be.equal(2)
        dummyClient.auth.userToken.should.be.equal(userToken)
      })
      it('should throw a TypeError if `userToken` is not a string', () => {
        (() => new Discojs({ userToken: 1337 })).should.throw(TypeError)
      })
    })
    context('consumerKey / consumerSecret', () => {
      it('should have an `auth` property with custom `consumerKey` and `consumerSecret`', () => {
        const dummyClient = new Discojs({ consumerKey, consumerSecret })
        dummyClient.should.have.property('auth')
        dummyClient.auth.should.have.all.keys('level', 'consumerKey', 'consumerSecret')
        dummyClient.auth.level.should.be.equal(1)
        dummyClient.auth.consumerKey.should.be.equal(consumerKey)
        dummyClient.auth.consumerSecret.should.be.equal(consumerSecret)
      })
      it('should not have an `auth` property with custom `consumerKey` but missing `consumerSecret`', () => {
        new Discojs({ consumerKey }).should.not.have.property('auth')
      })
      it('should not have an `auth` property with custom `consumerSecret` but missing `consumerKey`', () => {
        new Discojs({ consumerSecret }).should.not.have.property('auth')
      })
      it('should throw a TypeError if `consumerKey` is not a string', () => {
        (() => new Discojs({ consumerKey: 1337, consumerSecret })).should.throw(TypeError)
      })
      it('should throw a TypeError if `consumerSecret` is not a string', () => {
        (() => new Discojs({ consumerKey, consumerSecret: 1337 })).should.throw(TypeError)
      })
    })
  })
  context('Custom options', () => {
    context('userAgent', () => {
      it('should create an instance with custom `userAgent`', () => {
        const dummyClient = new Discojs({ userAgent })
        dummyClient.should.have.property('userAgent')
        dummyClient.userAgent.should.be.equal(userAgent)
      })
      it('should throw a TypeError if `userAgent` is not a string', () => {
        (() => new Discojs({ userAgent: 1337 })).should.throw(TypeError)
      })
    })
    context('outputFormat', () => {
      it('should create an instance with custom `outputFormat`', () => {
        const outputFormat = 'plaintext'
        const dummyClient = new Discojs({ outputFormat })
        dummyClient.should.have.property('outputFormat')
        dummyClient.outputFormat.should.be.equal(outputFormat)
      })
      it('should throw a TypeError if `outputFormat` is not `discogs`, `plaintext` or `html`', () => {
        (() => new Discojs({ outputFormat: 'test' })).should.throw(TypeError)
      })
    })
    context('requestLimit', () => {
      it('should create an instance with custom `requestLimit`', () => {
        new Discojs({ requestLimit: 10 }).should.be.an.instanceOf(Discojs)
      })
      it('should throw a TypeError if `requestLimit` is not a number', () => {
        (() => new Discojs({ requestLimit: '10' })).should.throw(TypeError)
      })
    })
    context('requestLimitAuth', () => {
      it('should create an instance with custom `requestLimitAuth`', () => {
        new Discojs({ userToken, requestLimitAuth: 10 }).should.be.an.instanceOf(Discojs)
      })
      it('should throw a TypeError if `requestLimitAuth` is not a number', () => {
        (() => new Discojs({ userToken, requestLimitAuth: '10' })).should.throw(TypeError)
      })
    })
    context('fetchOptions', () => {
      it('should create an instance with custom `fetchOptions`', () => {
        const fetchOptions = { proxy: 'http://foo.bar:1337' }
        const dummyClient = new Discojs({ fetchOptions })
        dummyClient.should.have.property('fetchOptions')
        dummyClient.fetchOptions.should.be.equal(fetchOptions)
      })
      it('should throw a TypeError if `fetchOptions` is not an object', () => {
        (() => new Discojs({ fetchOptions: 'http://foo.bar:1337' })).should.throw(TypeError)
      })
    })
  })
  context('Static methods', () => {
    it('should return supported currencies by Discogs', () => {
      Discojs.getSupportedCurrencies().should.be.equal(CURRENCIES)
    })
    it('should return release conditions from Discogs', () => {
      Discojs.getReleaseConditions().should.be.equal(RELEASE_CONDITIONS)
    })
    it('should return sleeve conditions from Discogs', () => {
      Discojs.getSleeveConditions().should.be.equal(SLEEVE_CONDITIONS)
    })
  })
})
