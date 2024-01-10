import { IsUUID, IsNotEmpty } from 'class-validator'
import { GetUserByAliasReqParams } from './get-user-by-alias-req-params.dto.js'

export class CreatePurchase extends GetUserByAliasReqParams {
  @IsUUID('4')
  @IsNotEmpty()
  readonly postId!: string
}
