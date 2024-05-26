import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module.js'
import { decorateApp } from './app/decorate-app.js'
import { setupDocsEndpoint } from './app/setup-docs-endpoint.js'
import { createLogger } from './common/create-logger.js'
import { ConfigService } from './config/config.service.js'

async function bootstrap(): Promise<void> {
  const logger = createLogger(bootstrap.name)
  const app = await NestFactory.create(AppModule, { logger })

  decorateApp(app)

  const config = app.get(ConfigService)
  const docsEndpointEnabled = config.get(config.keys.DOCS_ENDPOINT_ENABLED)

  if (docsEndpointEnabled) {
    setupDocsEndpoint(app, {
      pathname: config.get(config.keys.DOCS_ENDPOINT_PATHNAME),
      title: config.get(config.keys.DOCS_TITLE),
      version: config.get(config.keys.DOCS_VERSION),
      basePath: config.get(config.keys.DOCS_BASE_PATH),
      description: config.get(config.keys.DOCS_DESCRIPTION),
    })
  }

  const port = config.get(config.keys.PORT)
  const mode = config.get(config.keys.NODE_ENV)

  await app.listen(port, async () => {
    const url = await app.getUrl()

    logger.log(`Server is running (mode: ${mode}) on ${url}`)
  })
}

void bootstrap()
