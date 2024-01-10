import { Column, Entity, Index, JoinColumn, ManyToOne, Relation } from 'typeorm'
import { Post } from '@/posts/post.entity.js'
import { User } from './user.entity.js'
import { Decimal, DecimalTransformer } from '@/db/decimal-transformer.js'

@Entity({
  name: 'purchase',
})
@Index('idx_purchase_post_id_user_id', ['postId', 'userId'], { unique: true })
export class Purchase {
  @Column({
    name: 'post_id',
    type: 'uuid',
    primary: true,
    nullable: false,
  })
  readonly postId!: string

  @Column({
    name: 'user_id',
    type: 'uuid',
    primary: true,
    nullable: false,
  })
  readonly userId!: string

  @Column({
    name: 'purchase_price',
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: false,
    update: false,
    transformer: new DecimalTransformer(),
    default: () => '(0)',
  })
  readonly price!: Decimal

  // ***

  @ManyToOne(() => Post, (post) => post.purchases, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'post_id',
  })
  readonly post!: Relation<Post>

  @ManyToOne(() => User, (user) => user.purchases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  readonly user!: Relation<User>
}
