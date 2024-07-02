import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module.js'
import { decorateApp } from './app/decorate-app.js'
import { createLogger } from './common/create-logger.js'
import { ConfigModule } from './config/config.module.js'
import { ConfigService } from './config/config.service.js'

async function bootstrap(): Promise<void> {
  const logger = createLogger(bootstrap.name)
  const configContext = await NestFactory.createApplicationContext(ConfigModule, { logger })
  const config = configContext.get(ConfigService)

  configContext.flushLogs()
  configContext.close()
    .then(() => {
      logger.debug('Config context closed')
    })
    .catch((reason: unknown) => {
      logger.warn('Error while closing config context')
      logger.warn(reason)
    })

  const appModule = AppModule.register({
    importDevModule: config.isDevelopment(),
  })

  const app = await NestFactory.create(appModule, { logger })

  decorateApp(app)

  const port = config.get(config.keys.PORT)
  const mode = config.get(config.keys.NODE_ENV)

  await app.listen(port, async () => {
    const url = await app.getUrl()

    logger.log(`Server is running (mode: ${mode}) on ${url}`)
  })
}

void bootstrap()
