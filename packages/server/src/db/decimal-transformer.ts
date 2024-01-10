import { Decimal } from 'decimal.js'
import { type ValueTransformer } from 'typeorm'

export { type Decimal } from 'decimal.js'

export const decimalTransformer: ValueTransformer = {
  to(decimal?: Decimal): string | null {
    return decimal?.toString() ?? null
  },

  from(raw?: string): Decimal | null {
    return raw ? new Decimal(raw) : null
  },
}
