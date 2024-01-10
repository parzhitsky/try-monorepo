import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation } from 'typeorm'
import { Comment } from '@/comments/comment.entity.js'
import { type Decimal, DecimalTransformer } from '@/db/decimal-transformer.js'
import { Post } from '@/posts/post.entity.js'
import { Purchase } from './purchase.entity.js'

export const aliasPattern = /^[a-z_][a-z_\d-]*$/i

export const INVALID_ALIAS_MESSAGE =
  '$property must start with an a-z letter, and continue with letters, 0-9 digits, a hyphen and an underscore character'

@Entity({
  name: 'user',
})
export class User implements Api.User {
  @PrimaryGeneratedColumn('uuid', {
    name: 'user_id',
  })
  readonly id!: string

  @Column('varchar', {
    name: 'user_alias',
    unique: true,
    nullable: false,
  })
  readonly alias!: string

  @Column({
    name: 'user_credit',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: false,
    transformer: new DecimalTransformer(),
    default: () => '(0)',
  })
  credit!: Decimal

  // ***

  @OneToMany(() => Post, post => post.author)
  readonly posts!: Array<Relation<Post>>

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  readonly purchases!: Array<Relation<Purchase>>

  @OneToMany(() => Comment, comment => comment.author)
  readonly comments!: Array<Relation<Comment>>
}
