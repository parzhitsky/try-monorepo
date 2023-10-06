import { IsNotEmpty, IsString, Matches } from 'class-validator'
import { aliasPattern, INVALID_ALIAS_MESSAGE } from './user.entity.js'

export class CreateUser {
  @IsString()
  @IsNotEmpty()
  @Matches(aliasPattern, {
    message: INVALID_ALIAS_MESSAGE,
  })
  readonly alias!: string
}
