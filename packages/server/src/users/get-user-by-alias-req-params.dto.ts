import { IsNotEmpty, IsString, Matches } from 'class-validator'
import { aliasPattern, INVALID_ALIAS_MESSAGE } from './user.entity.js'

export class GetUserByAliasReqParams {
  @IsString()
  @IsNotEmpty()
  @Matches(aliasPattern, {
    message: INVALID_ALIAS_MESSAGE,
  })
  readonly userAlias!: string
}
