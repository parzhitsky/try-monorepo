import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { PaginationParams } from '@/common/pagination-params.dto.js'
import { CreatePurchaseReqBody } from './create-purchase-req-body.dto.js'
import { CreateUser } from './create-user.dto.js'
import { DeleteUserByAliasReqBody } from './delete-user-by-alias-req-body.dto.js'
import { GetUserByAliasReqParams } from './get-user-by-alias-req-params.dto.js'
import { type Purchase } from './purchase.entity.js'
import { type User } from './user.entity.js'
import { UsersService } from './users.service.js'
import { PurchasesService } from './purchases.service.js'

@Controller('users')
export class UsersController {
  constructor(
    protected readonly purchasesService: PurchasesService,
    protected readonly usersService: UsersService,
  ) {}

  @Get('/')
  async getUsers(
    @Query() { offset, limit }: PaginationParams,
  ): Promise<Api.HttpResponseBodyListPaginated<User>> {
    const { items, pagination } = await this.usersService.getUsers({ limit, offset })

    return {
      result: items,
      pagination,
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
    this.usersService.assertUserDataDeletionIsConfirmed(confirmations)

    const user = await this.usersService.deleteExistingUserByAlias(params.userAlias)

    return {
      result: user,
    }
  }

  @Post('/:userAlias/purchases')
  async buyPost(
    @Param() { userAlias }: GetUserByAliasReqParams,
    @Body() { postId }: CreatePurchaseReqBody,
  ): Promise<Api.HttpResponseBody<Purchase>> {
    const purchase = await this.purchasesService.createPurchase({ userAlias, postId })

    return {
      result: purchase,
    }
  }
}
