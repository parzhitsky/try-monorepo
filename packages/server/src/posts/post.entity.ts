import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Relation, JoinColumn } from 'typeorm'
import { Comment } from '@/comments/comment.entity.js'
import { type Decimal, DecimalTransformer } from '@/db/decimal-transformer.js'
import { Purchase } from '@/users/purchase.entity.js'
import { User } from '@/users/user.entity.js'

export const CONTENT_MAX_LENGTH = 255

@Entity({
  name: 'post',
})
export class Post implements Api.Post {
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

  @Column({
    name: 'post_price',
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: false,
    transformer: new DecimalTransformer(),
    default: () => '(0)',
  })
  readonly price!: Decimal

  // ***

  @ManyToOne(() => User, user => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_id',
  })
  readonly author!: Relation<User>

  @OneToMany(() => Purchase, (purchase) => purchase.post)
  readonly purchases!: Array<Relation<Purchase>>

  @OneToMany(() => Comment, comment => comment.post)
  readonly comments!: Array<Relation<Comment>>
}
