import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation, JoinColumn } from 'typeorm'
import { Post } from '@/posts/post.entity.js'
import { User } from '@/users/user.entity.js'

export const MAX_CONTENT_LENGTH = 255

@Entity({
  name: 'comment',
})
export class Comment implements Api.Comment {
  @PrimaryGeneratedColumn('uuid', {
    name: 'comment_id',
  })
  readonly id!: string

  @Column('varchar', {
    name: 'comment_content',
    length: MAX_CONTENT_LENGTH,
    nullable: false,
  })
  readonly content!: string

  // ***

  @ManyToOne(() => User, user => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_id',
  })
  readonly author!: Relation<User>

  @ManyToOne(() => Post, post => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'post_id',
  })
  readonly post!: Relation<Post>
}
