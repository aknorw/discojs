// We must replace `currency` by `curr_abbr` and transform camelcase to snakecase.
export function transformData(data: Record<string, any>) {
  return Object.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key === 'currency' ? 'curr_abbr' : key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)]: value,
    }),
    {} as Record<string, any>,
  )
}
