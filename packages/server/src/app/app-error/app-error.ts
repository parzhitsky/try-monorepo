import { randomUUID } from 'crypto'
import { type Digit } from '@@shared/digit/digit.type.js'

/** @private */
type ClientErrorStatusCode = `4${Digit}${Digit}`

/** @private */
type ServerErrorStatusCode = `5${Digit}${Digit}`

/** @private */
interface Detail {
  readonly public: boolean
  readonly message: string
}

/** @private */
interface GetDetailsParams {
  readonly publicOnly?: boolean
}

export abstract class AppError extends globalThis.Error {
  readonly id = randomUUID()
  readonly code = this.constructor.name
  abstract readonly statusCode: ClientErrorStatusCode | ServerErrorStatusCode
  protected readonly details: Detail[] = []
  protected readonly detailsPublic: Detail[] = []

  addDetail(detail: Detail): this {
    this.details.push(detail)

    if (detail.public) {
      this.detailsPublic.push(detail)
    }

    return this
  }

  getHead(): string {
    return `${this.code} (${this.id}): ${this.message}`
  }

  getDetails({
    publicOnly = true,
  }: GetDetailsParams = {}): readonly string[] {
    const details = publicOnly ? this.detailsPublic : this.details
    const messages = details.map((detail) => detail.message)

    return messages
  }
}

export abstract class ClientError extends AppError {
  abstract override readonly statusCode: ClientErrorStatusCode
}

export abstract class ServerError extends AppError {
  abstract override readonly statusCode: ServerErrorStatusCode
}
