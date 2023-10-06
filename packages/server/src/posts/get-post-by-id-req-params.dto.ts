import { IsNotEmpty, IsUUID } from 'class-validator'

export class GetPostByIdReqParams {
  @IsUUID('4')
  @IsNotEmpty()
  readonly postId!: string
}
