import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, Min } from 'class-validator'
import { INVALID_ALIAS_MESSAGE, aliasPattern } from '@/users/user.entity.js'
import { CONTENT_MAX_LENGTH } from './post.entity.js'

export const defaults = {
  price: 0,
} satisfies Partial<CreatePostReqBody>

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

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price!: number
}
