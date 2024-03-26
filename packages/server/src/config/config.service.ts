import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'
import { type SetLikeOfKeys, toSetLikeOfKeys } from '@@shared/to-set-like-of-keys/to-set-like-of-keys.js'
import { type ConfigDTO } from './config.dto.js'
import { EnvName } from './env-name.js'

/** @private */
type ConfigKey = keyof ConfigDTO

@Injectable()
export class ConfigService extends NestConfigService<ConfigDTO, true> {
  public readonly keys = (() => {
    const config = this.getInternalConfigObject()
    const keys = toSetLikeOfKeys(config) as SetLikeOfKeys<Required<ConfigDTO>>

    return keys
  })()

  protected getInternalConfigObject(): ConfigDTO {
    return this
      // @ts-expect-error: "`internalConfig` is private" (it should be `protected` really)
      .internalConfig
      ._PROCESS_ENV_VALIDATED
  }

  public override get<Key extends ConfigKey>(key: Key): ConfigDTO[Key] {
    return super.get(key)
  }

  public isDevelopment(): boolean {
    return this.get(this.keys.NODE_ENV) === EnvName.development
  }
}
