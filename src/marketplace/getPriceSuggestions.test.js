import chai from 'chai'

chai.should()

// CANNOT TEST WITHOUT SELLER SETTINGS

describe('Marketplace - getPriceSuggestionsMethod', () => {
  it('should return a TypeError if `id` is not a number', () => {
    client.getPriceSuggestions('test').catch(err => err.should.be.an.instanceOf(TypeError))
  })
})
