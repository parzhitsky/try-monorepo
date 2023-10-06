import { IsNotEmpty, IsUUID } from 'class-validator'

export class GetCommentByIdReqParams {
  @IsUUID('4')
  @IsNotEmpty()
  readonly commentId!: string
}
