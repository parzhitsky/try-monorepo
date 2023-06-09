import { Catch, type ArgumentsHost, HttpException, InternalServerErrorException, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { createLogger } from '@/common/create-logger.js'
import { ClientError, ServerError, AppError } from './app-error.js'

/** @private */
interface HttpExceptionBody {
  readonly statusCode: number
  readonly status: string
  readonly errorCode?: string
  readonly message?: string
  readonly details?: readonly string[]
  readonly errorId: string
}

@Catch()
export class AppErrorFilter extends BaseExceptionFilter {
  protected readonly logger = createLogger(this.constructor.name)

  private logAppError(error: AppError): void {
    const head = error.getHead()
    const details = error.getDetails({ publicOnly: false })

    this.logger.error(head)

    for (const detail of details) {
      this.logger.error(detail)
    }

    if (error instanceof ServerError) {
      this.logger.error(error.stack)
    }
  }

  protected logCaught(caught: unknown): void {
    if (caught instanceof AppError) {
      this.logAppError(caught)
    } else if (!(caught instanceof HttpException)) {
      this.logger.error(caught)
      this.logger.debug(`An error is thrown that's not an instance of ${AppError.name}`)
    }
  }

  private appErrorToHttpExceptionBody(error: AppError): HttpExceptionBody {
    const statusCode = +error.statusCode
    const status = HttpStatus[statusCode]
    const errorId = error.id

    if (error instanceof ClientError) {
      return {
        statusCode,
        status,
        errorId,
        errorCode: error.code,
        message: error.message,
        details: error.getDetails(),
      }
    }

    return {
      statusCode,
      status,
      errorId,
    }
  }

  protected caughtToHttpException(caught: unknown): HttpException {
    if (caught instanceof HttpException) {
      return caught
    }

    if (!(caught instanceof AppError)) {
      // No other info here, since it might be sensitive.
      // The assumption is that `caught` is properly logged.
      return new InternalServerErrorException()
    }

    const body = this.appErrorToHttpExceptionBody(caught)

    return new HttpException(body, body.statusCode)
  }

  override catch(caught: unknown, host: ArgumentsHost): void {
    this.logCaught(caught)

    const exception = this.caughtToHttpException(caught)

    super.catch(exception, host)
  }
}
