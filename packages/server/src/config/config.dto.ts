import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPort, IsPositive, IsSemVer, IsString, IsUrl, Matches, Min } from 'class-validator'
import { parseBoolean } from '@@shared/parse-boolean/parse-boolean.js'
import serverPackage from '@@/package.json' assert { type: 'json' }
import { EnvName } from './env-name.js'
import { IsValidEnum } from './is-valid-enum.decorator.js'
import { NotMatches } from './not-matches.decorator.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends ConfigDTO {}
  }
}

export const MIN_RATE_LIMITER_TIMEFRAME_MSEC = 1
export const MIN_RATE_LIMITER_MAX_HITS_PER_TIMEFRAME = 1

export const defaults = {
  NODE_ENV: EnvName.production,
  PORT: '3000',
  RATE_LIMITER_TIMEFRAME_MSEC: 1000,
  RATE_LIMITER_MAX_HITS_PER_TIMEFRAME: 5,
  DOCS_ENDPOINT_ENABLED: true,
  DOCS_ENDPOINT_PATHNAME: 'docs',
  DOCS_TITLE: serverPackage.name,
  DOCS_VERSION: serverPackage.version,
} satisfies Partial<ConfigDTO>

/**
 * Set of environment variables and their respective validations.
 *
 * Three levels of property optionality:
 * - non-optional (required): the value is required by the application, and there is no default value
 * (see {@link ConfigDTO.DB_HOST}, {@link ConfigDTO.DB_PORT}, {@link ConfigDTO.DB_USER} etc.)
 * - half-optional: the value is required by the application, but a default value can be inferred/used
 * (see {@link ConfigDTO.NODE_ENV}, {@link ConfigDTO.DB_NAME}, {@link ConfigDTO.PORT} etc.)
 * - full-optional: the value can be safely skipped
 * (see {@link ConfigDTO.DOCS_BASE_PATH}, {@link ConfigDTO.DOCS_DESCRIPTION} etc.)
 */
export class ConfigDTO {
  @IsValidEnum(EnvName)
  readonly NODE_ENV: EnvName = defaults.NODE_ENV

  @IsString()
  @IsNotEmpty()
  readonly DB_HOST!: string

  @IsPort()
  readonly DB_PORT!: string

  @IsString()
  @IsNotEmpty()
  readonly DB_NAME: string = this.NODE_ENV // yes, "this"; by default, each environment is connected to its own database

  @IsString()
  @IsNotEmpty()
  readonly DB_USER!: string

  @IsString()
  @IsNotEmpty()
  readonly DB_PASS!: string

  @IsPort()
  readonly PORT: string = defaults.PORT

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(MIN_RATE_LIMITER_TIMEFRAME_MSEC)
  readonly RATE_LIMITER_TIMEFRAME_MSEC: number =
    defaults.RATE_LIMITER_TIMEFRAME_MSEC

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(MIN_RATE_LIMITER_MAX_HITS_PER_TIMEFRAME)
  readonly RATE_LIMITER_MAX_HITS_PER_TIMEFRAME: number =
    defaults.RATE_LIMITER_MAX_HITS_PER_TIMEFRAME

  @IsOptional()
  @Transform(({ value }) => parseBoolean(value) ?? value)
  @IsBoolean()
  readonly DOCS_ENDPOINT_ENABLED: boolean = defaults.DOCS_ENDPOINT_ENABLED

  @IsString()
  @Matches(/^[_.]?[a-z][\w]*$/i, {
    message: '$property must start with a latin letter, an underscore, or a dot, and continue with alphanumeric characters',
  })
  @NotMatches(/^[_.]?v\d+$/i, {
    message: '$property must not resemble a version prefix',
  })
  readonly DOCS_ENDPOINT_PATHNAME: string = defaults.DOCS_ENDPOINT_PATHNAME

  @IsString()
  @IsNotEmpty()
  readonly DOCS_TITLE: string = defaults.DOCS_TITLE

  @IsString()
  @IsSemVer()
  readonly DOCS_VERSION: string = defaults.DOCS_VERSION

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl({
    allow_fragments: false,
    allow_query_components: false,
    allow_underscores: true,
    disallow_auth: true,
    require_host: false,
    require_tld: false,
    require_valid_protocol: false,
    validate_length: false,
  })
  readonly DOCS_BASE_PATH?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly DOCS_DESCRIPTION?: string
}
