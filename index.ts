type Filter = {
  (array: number[], f: (item: number) => boolean): number[]
  (array: string[], f: (item: string) => boolean): string[]
  (array: { [key: string]: string }[], f: (item: { [key: string]: string }) => boolean): { [key: string]: string }[]
}
function call<T extends unknown[], R>(f: (...args: T) => R, ...args: T): R {
  return f(...args)
}
function fill(length: number , value: string): string[] {
  return Array.from({length}, () => value)
}
let a = call(fill, 10 ,'a')
let b = call(fill, 10)