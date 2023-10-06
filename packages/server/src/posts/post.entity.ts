import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Relation, JoinColumn } from 'typeorm'
import { Comment } from '@/comments/comment.entity.js'
import { User } from '@/users/user.entity.js'

export const CONTENT_MAX_LENGTH = 255

@Entity({
  name: 'post',
})
export class Post {
  @PrimaryGeneratedColumn('uuid', {
    name: 'post_id',
  })
  readonly id!: string

  @Column('varchar', {
    name: 'post_content',
    length: CONTENT_MAX_LENGTH,
    nullable: false,
  })
  readonly content!: string

  // ***

  @ManyToOne(() => User, user => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_id',
  })
  readonly author!: Relation<User>

  @OneToMany(() => Comment, comment => comment.post)
  readonly comments!: Array<Relation<Comment>>
}
