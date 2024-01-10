import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { type Decimal } from 'decimal.js'
import { type FindOptionsRelations, ILike, Repository } from 'typeorm'
import { type ListPaginated } from '@@shared/pagination/list-paginated.type.js'
import { ClientError } from '@/app/app-error/app-error.js'
import { type PaginationParams } from '@/common/pagination-params.dto.js'
import { type CreateUser } from './create-user.dto.js'
import { User } from './user.entity.js'

export const GET_USERS_DEFAULT_OFFSET = 0

export const GET_USERS_DEFAULT_LIMIT = 20

/** @private */
const userStuffings = {
  bare: {
    comments: false,
    posts: false,
    purchases: false,
  },
  full: {
    comments: true,
    posts: true,
    purchases: true,
  },
} satisfies Record<string, FindOptionsRelations<User>>

/** @private */
interface FindUserByAliasParams {
  readonly stuffing?: keyof typeof userStuffings
}

export interface UserDataDeletionConfirmations {
  readonly confirmDeleteOwnPosts?: true
  readonly confirmDeleteOwnComments?: true
}

@Injectable()
export class UsersService {
  protected readonly newUserInitialCredit: number = 0.3

  constructor(
    @InjectRepository(User)
    protected readonly usersRepo: Repository<User>,
  ) {}

  async getUsers({
    offset = GET_USERS_DEFAULT_OFFSET,
    limit = GET_USERS_DEFAULT_LIMIT,
  }: PaginationParams): Promise<ListPaginated<User>> {
    const [items, totalCount] = await this.usersRepo.findAndCount({
      skip: offset,
      take: limit,
    })

    return {
      items,
      pagination: {
        limit,
        offset,
        totalCount,
      },
    }
  }

  protected async findUserByAlias(alias: string, {
    stuffing: stuffingName = 'bare',
  }: FindUserByAliasParams = {}): Promise<User | null> {
    const user = await this.usersRepo.findOne({
      where: {
        alias: ILike(alias),
      },
      relations: userStuffings[stuffingName],
    })

    return user
  }

  async createUser({ alias }: CreateUser): Promise<User> {
    const userExisting = await this.findUserByAlias(alias)

    if (userExisting != null) {
      throw new UserAliasTakenError(alias)
        .addDetail({
          public: true,
          message: 'User alias supports both uppercase and lowercase letters, but their comparison is case-insensitive (e.g., cannot create "mia" if "Mia" exists)',
        })
    }

    const user = this.usersRepo.create({
      alias,
      credit: this.newUserInitialCredit,
    })

    await this.usersRepo.save(user)

    return user
  }

  async getExistingUserByAlias(alias: string): Promise<User> {
    const user = await this.findUserByAlias(alias, { stuffing: 'full' })

    if (user == null) {
      throw new UserNotFoundByAliasError(alias)
    }

    return user
  }

  assertUserDataDeletionIsConfirmed({
    confirmDeleteOwnComments,
    confirmDeleteOwnPosts,
  }: UserDataDeletionConfirmations): void {
    if (!confirmDeleteOwnComments || !confirmDeleteOwnPosts) {
      throw new UserDataDeletionIsNotConfirmedError()
        .addDetailIf(!confirmDeleteOwnComments, () => ({
          public: true,
          message: 'Request body must include "confirmDeleteOwnComments: true" to confirm deletion of user\'s own comments',
        }))
        .addDetailIf(!confirmDeleteOwnPosts, () => ({
          public: true,
          message: 'Request body must include "confirmDeleteOwnPosts: true" to confirm deletion of user\'s own posts. Please note that deleting a post also deletes all of its comments (whether own or not)',
        }))
    }
  }

  async deleteExistingUserByAlias(alias: string): Promise<User> {
    const user = await this.getExistingUserByAlias(alias)

    await this.usersRepo.remove(user)

    return user
  }

  /** @internal */
  async changeUserCreditByUser(user: User, creditDelta: Decimal): Promise<void> {
    user.credit = user.credit.plus(creditDelta)

    await this.usersRepo.save(user)
  }
}

export class UserAliasTakenError extends ClientError {
  public override readonly statusCode = '409'

  constructor(
    public readonly alias: string,
  ) {
    super(`User with an alias similar to "${alias}" already exists, try another one`)
  }
}

export class UserNotFoundByAliasError extends ClientError {
  public override readonly statusCode = '404'

  constructor(
    public readonly alias: string,
  ) {
    super(`User with alias "${alias}" was not found`)
  }
}

export class UserDataDeletionIsNotConfirmedError extends ClientError {
  public override readonly statusCode = '400'

  constructor() {
    super('Client did not confirm deletion of user data along with the user')
  }
}
