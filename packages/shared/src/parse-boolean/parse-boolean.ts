/**
 * Attempts to parse a string input to a boolean.
 * Note that this function only tries to parse boolean values from strings,
 * without trying to convert the input to its closest possible boolean counterpart.
 */
export function parseBoolean(input: string): boolean | undefined {
  switch (input) {
    case 'true':
      return true
    case 'false':
      return false
  }
}
