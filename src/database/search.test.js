import { parse } from 'querystring'
import chai from 'chai'

chai.should()

const URL_REGEX = /^https:\/\/api\.discogs\.com\/.*\?(.*)$/

const query = 'nirvana'
const type = 'release'
const title = 'nirvana - nevermind'
const releaseTitle = 'nevermind'
const credit = 'kurt'
const artist = 'nirvana'
const anv = 'nirvana'
const label = 'dgc'
const genre = 'rock'
const style = 'grunge'
const country = 'canada'
const year = 1991
const format = 'album'
const catno = 'DGCD-24425'
const barcode = '089841444440'
const track = 'smells like teen spirit'
const submitter = 'milKt'
const contributor = 'jerome99'

describe('Database - searchDatabaseMethod', () => {
  it('should search for all releases if no param', async () => {
    const data = await client.searchDatabase()
    data.should.be.an('object').and.have.property('results')
  })
  it('should search for `query`', async () => {
    const data = await client.searchDatabase({ query }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).q.should.be.equal(query)
  })
  it('should return a TypeError if `query` is not a string', () => {
    client.searchDatabase({ query: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `type`', async () => {
    const data = await client.searchDatabase({ type }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).type.should.be.equal(type)
  })
  it('should return a TypeError if `type` is not a `release`, `master`, `artist` or `label`', () => {
    client.searchDatabase({ type: 'test' }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `title`', async () => {
    const data = await client.searchDatabase({ title }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).title.should.be.equal(title)
  })
  it('should return a TypeError if `title` is not a string', () => {
    client.searchDatabase({ title: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `releaseTitle`', async () => {
    const data = await client.searchDatabase({ releaseTitle }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).release_title.should.be.equal(releaseTitle)
  })
  it('should return a TypeError if `releaseTitle` is not a string', () => {
    client.searchDatabase({ releaseTitle: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `credit`', async () => {
    const data = await client.searchDatabase({ credit }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).credit.should.be.equal(credit)
  })
  it('should return a TypeError if `credit` is not a string', () => {
    client.searchDatabase({ credit: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `artist`', async () => {
    const data = await client.searchDatabase({ artist }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).artist.should.be.equal(artist)
  })
  it('should return a TypeError if `artist` is not a string', () => {
    client.searchDatabase({ artist: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `anv`', async () => {
    const data = await client.searchDatabase({ anv }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).anv.should.be.equal(anv)
  })
  it('should return a TypeError if `anv` is not a string', () => {
    client.searchDatabase({ anv: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `label`', async () => {
    const data = await client.searchDatabase({ label }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).label.should.be.equal(label)
  })
  it('should return a TypeError if `label` is not a string', () => {
    client.searchDatabase({ label: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `genre`', async () => {
    const data = await client.searchDatabase({ genre }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).genre.should.be.equal(genre)
  })
  it('should return a TypeError if `genre` is not a string', () => {
    client.searchDatabase({ genre: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `style`', async () => {
    const data = await client.searchDatabase({ style }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).style.should.be.equal(style)
  })
  it('should return a TypeError if `style` is not a string', () => {
    client.searchDatabase({ style: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `country`', async () => {
    const data = await client.searchDatabase({ country }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).country.should.be.equal(country)
  })
  it('should return a TypeError if `country` is not a string', () => {
    client.searchDatabase({ country: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `year`', async () => {
    const data = await client.searchDatabase({ year }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).year.should.be.equal(year.toString())
  })
  it('should return a TypeError if `year` is not a string or number', () => {
    client.searchDatabase({ year: new Date() }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `format`', async () => {
    const data = await client.searchDatabase({ format }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).format.should.be.equal(format)
  })
  it('should return a TypeError if `format` is not a string', () => {
    client.searchDatabase({ format: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `catno`', async () => {
    const data = await client.searchDatabase({ catno }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).catno.should.be.equal(catno)
  })
  it('should return a TypeError if `catno` is not a string', () => {
    client.searchDatabase({ catno: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `barcode`', async () => {
    const data = await client.searchDatabase({ barcode }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).barcode.should.be.equal(barcode)
  })
  it('should return a TypeError if `barcode` is not a string', () => {
    client.searchDatabase({ barcode: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `track`', async () => {
    const data = await client.searchDatabase({ track }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).track.should.be.equal(track)
  })
  it('should return a TypeError if `track` is not a string', () => {
    client.searchDatabase({ track: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `submitter`', async () => {
    const data = await client.searchDatabase({ submitter }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).submitter.should.be.equal(submitter)
  })
  it('should return a TypeError if `submitter` is not a string', () => {
    client.searchDatabase({ submitter: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should search for `contributor`', async () => {
    const data = await client.searchDatabase({ contributor }, { perPage: 1 })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object').and.have.property('urls')
    data.pagination.urls.should.be.an('object').and.have.all.keys('last', 'next')
    parse(URL_REGEX.exec(data.pagination.urls.last)[1]).contributor.should.be.equal(contributor)
  })
  it('should return a TypeError if `contributor` is not a string', () => {
    client.searchDatabase({ contributor: 1337 }).catch(err => err.should.be.an.instanceOf(TypeError))
  })
  it('should accept pagination', async () => {
    const page = 1
    const perPage = 3
    const data = await client.searchDatabase({ query }, { page, perPage })
    data.should.be.an('object').and.have.property('pagination')
    data.pagination.should.be.an('object')
    data.pagination.should.have.property('per_page')
    data.pagination.per_page.should.be.equal(perPage)
    data.pagination.should.have.property('page')
    data.pagination.page.should.be.equal(page)
  })
})
