import chai from 'chai'

import sort, { sortOrders } from './sort'

const sortFields = [
  'year',
  'title',
  'format',
]

chai.should()

describe('Utils - sortFn', () => {
  it('should throw a TypeError if no param', () => {
    (() => sort()).should.throw(TypeError)
  })
  it('should return default options if no custom sort', () => {
    const data = sort({}, sortFields)
    data.should.be.an('object').and.have.all.keys('sort', 'sort_order')
    data.sort.should.be.equal(sortFields[0])
    data.sort_order.should.be.equal(sortOrders[0])
  })
  it('should throw a TypeError if `sortFields` is not an array', () => {
    (() => sort({}, 'test')).should.throw(TypeError)
  })
  it('should throw a TypeError if `sortFields` is an empty array', () => {
    (() => sort({}, [])).should.throw(TypeError)
  })
  it('should accept `by` param', () => {
    const by = sortFields[Math.floor(Math.random() * sortFields.length)]
    const data = sort({ by }, sortFields)
    data.should.be.an('object').and.have.all.keys('sort', 'sort_order')
    data.sort.should.be.equal(by)
    data.sort_order.should.be.equal(sortOrders[0])
  })
  it('should use default `by` param if not in `sortFields`', () => {
    const by = 'test'
    const data = sort({ by }, sortFields)
    data.should.be.an('object').and.have.all.keys('sort', 'sort_order')
    data.sort.should.be.equal(sortFields[0])
    data.sort_order.should.be.equal(sortOrders[0])
  })
  it('should accept `order` param', () => {
    const order = sortOrders[1]
    const data = sort({ order }, sortFields)
    data.should.be.an('object').and.have.all.keys('sort', 'sort_order')
    data.sort.should.be.equal(sortFields[0])
    data.sort_order.should.be.equal(order)
  })
  it('should use default `order` param if not in `sortOrders`', () => {
    const order = 'test'
    const data = sort({ order }, sortFields)
    data.should.be.an('object').and.have.all.keys('sort', 'sort_order')
    data.sort.should.be.equal(sortFields[0])
    data.sort_order.should.be.equal(sortOrders[0])
  })
})
