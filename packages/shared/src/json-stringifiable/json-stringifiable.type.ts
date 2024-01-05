export type JsonStringifiable =
  | string | number | boolean
  | null
  | JsonStringifiable[]
  | { [key: string | number]: JsonStringifiable }
  | {} // eslint-disable-line @typescript-eslint/ban-types
