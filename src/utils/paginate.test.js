import chai from 'chai'

import paginate from './paginate'

// eslint-disable-next-line no-unused-vars
const should = chai.should()

describe('Utils - paginateFn', () => {
  it('should return default pagination options if no param', () => {
    const data = paginate()
    data.should.be.an('object').and.have.all.keys('page', 'per_page')
    data.page.should.be.equal(1)
    data.per_page.should.be.equal(50)
  })
  it('should accept `page` param', () => {
    const page = 5
    const data = paginate({ page })
    data.should.be.an('object').and.have.all.keys('page', 'per_page')
    data.page.should.be.equal(page)
    data.per_page.should.be.equal(50)
  })
  it('should throw a TypeError if `page` is not a number', () => {
    (() => paginate({ page: 'test' })).should.throw(TypeError)
  })
  it('should use default `page` param if <= 0', () => {
    const page = -10
    const data = paginate({ page })
    data.should.be.an('object').and.have.all.keys('page', 'per_page')
    data.page.should.be.equal(1)
    data.per_page.should.be.equal(50)
  })
  it('should accept `perPage` param', () => {
    const perPage = 10
    const data = paginate({ perPage })
    data.should.be.an('object').and.have.all.keys('page', 'per_page')
    data.page.should.be.equal(1)
    data.per_page.should.be.equal(perPage)
  })
  it('should use default `perPage` param if <= 0 || > 100', () => {
    const perPage = 200
    const data = paginate({ perPage })
    data.should.be.an('object').and.have.all.keys('page', 'per_page')
    data.page.should.be.equal(1)
    data.per_page.should.be.equal(50)
  })
  it('should throw a TypeError if `perPage` is not a number', () => {
    (() => paginate({ perPage: 'test' })).should.throw(TypeError)
  })
})
