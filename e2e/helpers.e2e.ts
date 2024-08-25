import { CurrenciesEnum, Discojs, ReleaseConditionsEnum, SleeveConditionsEnum } from '../src'

declare const client: Discojs

describe('Helpers', () => {
  describe('Static methods', () => {
    it('should return supported currencies by Discogs', () => {
      expect(Discojs.getSupportedCurrencies()).toEqual(Object.values(CurrenciesEnum))
    })
    it('should return release conditions from Discogs', () => {
      expect(Discojs.getReleaseConditions()).toEqual(Object.values(ReleaseConditionsEnum))
    })
    it('should return sleeve conditions from Discogs', () => {
      expect(Discojs.getSleeveConditions()).toEqual(Object.values(SleeveConditionsEnum))
    })
  })

  describe('fetchImage', () => {
    it('should fetch an image', async () => {
      const imageUri =
        'https://img.discogs.com/B6Jhg03KWlxWnhEyFkeVF4J2wLk=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-249504-1334592212.jpeg.jpg'
      const apiResponse = await client.fetchImage(imageUri)
      expect(apiResponse.type).toEqual('image/jpeg')
    })
  })
})
