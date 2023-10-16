import { type Comment } from '@/api/comment/comment.type.js'
import { type User } from '@/api/user/user.type.js'

export interface Post {
  readonly id: string
  readonly content: string
  readonly author: User
  readonly comments: Comment[]
}
