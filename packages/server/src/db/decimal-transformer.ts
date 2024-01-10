import { Decimal } from 'decimal.js'
import { type ValueTransformer } from 'typeorm'

export { type Decimal } from 'decimal.js'

export class DecimalTransformer implements ValueTransformer {
  to(decimal?: Decimal): string | null {
    return decimal?.toString() ?? null
  }

  from(raw?: string): Decimal | null {
    return raw ? new Decimal(raw) : null
  }
}
