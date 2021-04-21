type Filter = {
  (array: number[], f: (item: number) => boolean): number[]
  (array: string[], f: (item: string) => boolean): string[]
  (array: { [key: string]: string }[], f: (item: { [key: string]: string }) => boolean): { [key: string]: string }[]
}