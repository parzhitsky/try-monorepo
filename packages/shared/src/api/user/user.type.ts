import { type Comment } from '@/api/comment/comment.type.js'
import { type Post } from '@/api/post/post.type.js'

export interface User {
  readonly id: string
  readonly alias: string
  readonly posts: Post[]
  readonly comments: Comment[]
}
