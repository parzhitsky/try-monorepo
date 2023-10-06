import { Equals, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'
import { type UserDataDeletionConfirmations } from './users.service.js'

export class DeleteUserByAliasReqBody implements UserDataDeletionConfirmations {
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  @Equals(true)
  readonly confirmDeleteOwnPosts?: true

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  @Equals(true)
  readonly confirmDeleteOwnComments?: true
}
