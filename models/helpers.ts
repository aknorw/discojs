import * as t from 'io-ts'

/**
 * Helper to use Enums in io-ts types.
 *
 * @internal
 */
export function makeEnumIOType<T extends object>(srcEnum: T) {
  const enumValues = new Set(Object.values(srcEnum))
  return new t.Type<T[keyof T], string>(
    'Enum',
    (value: any): value is T[keyof T] => Boolean(value && enumValues.has(value)),
    (value, context) =>
      !value || !enumValues.has(value) ? t.failure(value, context) : t.success((value as any) as T[keyof T]),
    (value) => String(value),
  )
}
