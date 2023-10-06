import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClientError } from '@/app/app-error/app-error.js'
import { type CreateUser } from './create-user.dto.js'
import { User } from './user.entity.js'

export interface UserDataDeletionConfirmations {
  readonly confirmDeleteOwnPosts?: true
  readonly confirmDeleteOwnComments?: true
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    protected readonly usersRepo: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepo.find()

    return users
  }

  async createUser({ alias }: CreateUser): Promise<User> {
    const userExisting = await this.usersRepo.findOne({
      where: { alias },
    })

    if (userExisting != null) {
      throw new UserAliasTakenError(alias)
    }

    const user = this.usersRepo.create({ alias })

    await this.usersRepo.save(user)

    return user
  }

  async getExistingUserByAlias(alias: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { alias },
      relations: {
        comments: true,
        posts: true,
      },
    })

    if (user == null) {
      throw new UserNotFoundByAliasError(alias)
    }

    return user
  }

  async assertUserDataDeletionIsConfirmed(confirmations: UserDataDeletionConfirmations): Promise<void> {
    if (!confirmations.confirmDeleteOwnComments || !confirmations.confirmDeleteOwnPosts) {
      throw new UserDataDeletionIsNotConfirmedError()
        .addDetail({
          public: true,
          message: 'Request body must include "confirmDeleteOwnComments: true" to confirm deletion of user\'s own comments',
        })
        .addDetail({
          public: true,
          message: 'Request body must include "confirmDeleteOwnPosts: true" to confirm deletion of user\'s own posts. Please note that deleting a post also deletes its comments, both own and not',
        })
    }
  }

  async deleteExistingUserByAlias(alias: string): Promise<User> {
    const user = await this.getExistingUserByAlias(alias)

    await this.usersRepo.remove(user)

    return user
  }
}

export class UserAliasTakenError extends ClientError {
  public override readonly statusCode = '409'

  constructor(
    public readonly alias: string,
  ) {
    super(`User with alias "${alias}" already exists, try another one`)
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
