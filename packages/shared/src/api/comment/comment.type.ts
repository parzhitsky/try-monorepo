import { type Post } from '@/api/post/post.type.js'
import { type User } from '@/api/user/user.type.js'

export interface Comment {
  readonly id: string
  readonly content: string
  readonly author: User
  readonly post: Post
}
