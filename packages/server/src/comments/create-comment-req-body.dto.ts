import { INVALID_ALIAS_MESSAGE, aliasPattern } from '@/users/user.entity.js'
import { IsNotEmpty, IsString, IsUUID, Matches, MaxLength } from 'class-validator'
import { MAX_CONTENT_LENGTH } from './comment.entity.js'

export class CreateCommentReqBody {
  @IsString()
  @IsNotEmpty()
  @Matches(aliasPattern, {
    message: INVALID_ALIAS_MESSAGE,
  })
  readonly authorAlias!: string

  @IsUUID('4')
  @IsNotEmpty()
  readonly postId!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CONTENT_LENGTH)
  readonly content!: string
}
