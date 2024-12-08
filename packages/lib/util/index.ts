export function range(n: number): number[] {
  const result = Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = i;
  }
  return result;
}

export type FixedArray<
  T,
  N extends number,
  R extends T[] = []
> = R["length"] extends N ? R : FixedArray<T, N, [...R, T]>;

export function fixedArray<T, N extends number>(
  value: T,
  length: N
): FixedArray<T, N> {
  return Array(length).fill(value) as FixedArray<T, N>;
}
