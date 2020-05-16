import { CurrenciesEnum, Discojs, ReleaseConditionsEnum, SleeveConditionsEnum } from '../lib'

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
