import { registerDecorator, type ValidationOptions, matches } from 'class-validator'

/** @private */
type ArgsRegExp = [pattern: RegExp, options?: ValidationOptions]

/** @private */
type ArgsString = [pattern: string, modifiers?: string, options?: ValidationOptions]

/** @private */
type Args = ArgsRegExp | ArgsString

/** @private */
interface NotMatchesParams {
  readonly pattern: RegExp
  readonly options: ValidationOptions | undefined
}

/** @private */
function parseParams(args: Args): NotMatchesParams {
  const [arg0, arg1, arg2] = args

  if (arg0 instanceof RegExp) {
    return {
      pattern: arg0,
      options: arg1 as ValidationOptions,
    }
  }

  return {
    pattern: new RegExp(arg0, arg1 as string),
    options: arg2,
  }
}

export function NotMatches(...args: ArgsRegExp): PropertyDecorator
export function NotMatches(...args: ArgsString): PropertyDecorator
export function NotMatches(...args: Args): PropertyDecorator {
  const { pattern, options } = parseParams(args)

  return (target, key): void => {
    const propertyName = String(key)

    registerDecorator({
      async: false,
      name: 'notMatches',
      propertyName,
      target: target.constructor,
      options,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && !matches(value, pattern)
        },
        defaultMessage() {
          return `${propertyName} must not match ${pattern} regular expression`
        },
      },
    })
  }
}
