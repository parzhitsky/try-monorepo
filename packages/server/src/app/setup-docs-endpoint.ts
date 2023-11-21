import { type INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder as DocumentConfigBuilder } from '@nestjs/swagger'

/** @private */
interface SetupDocsEndpointParams {
  readonly pathname: string
  readonly title: string
  readonly version: string
  readonly basePath?: string
  readonly description?: string
}

export function setupDocsEndpoint(app: INestApplication, {
  pathname,
  title,
  version,
  basePath,
  description,
}: SetupDocsEndpointParams): void {
  const documentConfigBuilder = new DocumentConfigBuilder()
    .setTitle(title)
    .setVersion(version)

  if (basePath != null) {
    documentConfigBuilder.setBasePath(basePath)
  }

  if (description != null) {
    documentConfigBuilder.setDescription(description)
  }

  const documentConfig = documentConfigBuilder.build()
  const document = SwaggerModule.createDocument(app, documentConfig)

  SwaggerModule.setup(pathname, app, document)
}
