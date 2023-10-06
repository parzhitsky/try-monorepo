import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator'
import { INVALID_ALIAS_MESSAGE, aliasPattern } from '@/users/user.entity.js'
import { CONTENT_MAX_LENGTH } from './post.entity.js'

export class CreatePostReqBody {
  @IsString()
  @IsNotEmpty()
  @Matches(aliasPattern, {
    message: INVALID_ALIAS_MESSAGE,
  })
  readonly authorAlias!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(CONTENT_MAX_LENGTH)
  readonly content!: string
}
