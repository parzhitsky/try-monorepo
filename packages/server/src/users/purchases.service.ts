import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { type Decimal } from 'decimal.js'
import { Repository } from 'typeorm'
import { ClientError } from '@/app/app-error/app-error.js'
import { PostsService } from '@/posts/posts.service.js'
import { type CreatePurchase } from './create-purchase.dto.js'
import { Purchase } from './purchase.entity.js'
import { UsersService } from './users.service.js'

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    protected readonly purchasesRepo: Repository<Purchase>,
    protected readonly postsService: PostsService,
    protected readonly usersService: UsersService,
  ) {}

  async createPurchase({ userAlias, postId }: CreatePurchase): Promise<Purchase> {
    const post = await this.postsService.getExistingPostById(postId)
    const user = await this.usersService.getExistingUserByAlias(userAlias)

    const purchaseMaybe = await this.purchasesRepo.findOneBy({
      userId: user.id,
      postId: post.id,
    })

    if (purchaseMaybe != null) {
      throw new PostAlreadyPurchasedError(user.alias, post.id)
        .addDetail({
          public: true,
          message: `User "${user.alias}" had already purchased the post "${post.id}"`,
        })
    }

    if (user.credit.lessThan(post.price)) {
      throw new UserCreditInsufficientError(user.credit, post.price)
        .addDetail({
          public: true,
          message: `User has ${user.credit}`,
        })
        .addDetail({
          public: true,
          message: `Post is priced at ${post.price}`,
        })
    }

    const purchase = this.purchasesRepo.create({
      postId: post.id,
      price: post.price,
      userId: user.id,
    })

    const creditDelta = post.price.negated()

    await Promise.all([
      this.usersService.changeUserCreditByUser(user, creditDelta),
      this.usersService.changeUserCreditByUser(post.author, post.price),
    ])

    await this.purchasesRepo.save(purchase)

    return purchase
  }
}

export class UserCreditInsufficientError extends ClientError {
  public override readonly statusCode = '400'

  constructor(
    public readonly userCredit: Decimal,
    public readonly postPrice: Decimal,
  ) {
    super('Cannot purchase post: user has insufficient credit')
  }
}

export class PostAlreadyPurchasedError extends ClientError {
  public override readonly statusCode = '409'

  constructor(
    public readonly userAlias: string,
    public readonly postId: string,
  ) {
    super('Cannot purchase post: user has already purchased post')
  }
}
