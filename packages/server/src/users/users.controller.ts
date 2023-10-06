import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { CreateUser } from './create-user.dto.js'
import { DeleteUserByAliasReqBody } from './delete-user-by-alias-req-body.dto.js'
import { GetUserByAliasReqParams } from './get-user-by-alias-req-params.dto.js'
import { type User } from './user.entity.js'
import { UsersService } from './users.service.js'

@Controller('users')
export class UsersController {
  constructor(
    protected readonly usersService: UsersService,
  ) {}

  @Get('/')
  async getUsers(): Promise<Api.HttpResponseBody<User[]>> {
    const users = await this.usersService.getUsers()

    return {
      result: users,
    }
  }

  @Post('/')
  async createUser(
    @Body() body: CreateUser,
  ): Promise<Api.HttpResponseBody<User>> {
    const user = await this.usersService.createUser(body)

    return {
      result: user,
    }
  }

  @Get('/:userAlias')
  async getUserByAlias(
    @Param() params: GetUserByAliasReqParams,
  ): Promise<Api.HttpResponseBody<User>> {
    const user = await this.usersService.getExistingUserByAlias(params.userAlias)

    return {
      result: user,
    }
  }

  @Delete('/:userAlias')
  async deleteUserByAlias(
    @Param() params: GetUserByAliasReqParams,
    @Body() confirmations: DeleteUserByAliasReqBody,
  ): Promise<Api.HttpResponseBody<User>> {
    await this.usersService.assertUserDataDeletionIsConfirmed(confirmations)

    const user = await this.usersService.deleteExistingUserByAlias(params.userAlias)

    return {
      result: user,
    }
  }
}
