// https://github.com/Microsoft/TypeScript/issues/15480#issuecomment-601633419

// internal helper types
type IncrementLength<A extends Array<any>> = ((x: any, ...xs: A) => void) extends (...a: infer X) => void ? X : never
type EnumerateRecursive<A extends Array<any>, N extends number> = A['length'] extends infer X
  ? X | { 0: never; 1: EnumerateRecursive<IncrementLength<A>, N> }[X extends N ? 0 : 1]
  : never

// actual utility types
export type Enumerate<N extends number> = Exclude<EnumerateRecursive<[], N>, N>
export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>
