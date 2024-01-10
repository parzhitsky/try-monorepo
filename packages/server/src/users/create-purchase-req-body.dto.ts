import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreatePurchaseReqBody {
  @IsUUID('4')
  @IsNotEmpty()
  readonly postId!: string
}
