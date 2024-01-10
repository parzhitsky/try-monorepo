import { Body, Controller, Get, Post as HttpPost, Param, Query } from '@nestjs/common'
import { PaginationParams } from '@/common/pagination-params.dto.js'
import { UsersService } from '@/users/users.service.js'
import { CreatePostReqBody } from './create-post-req-body.dto.js'
import { GetPostByIdReqParams } from './get-post-by-id-req-params.dto.js'
import { type Post } from './post.entity.js'
import { PostsService } from './posts.service.js'

@Controller('posts')
export class PostsController {
  constructor(
    protected readonly postsService: PostsService,
    protected readonly usersService: UsersService,
  ) {}

  @Get('/')
  async getPosts(
    @Query() { offset, limit }: PaginationParams,
  ): Promise<Api.HttpResponseBodyListPaginated<Post>> {
    const { items, pagination } = await this.postsService.getPosts({ offset, limit })

    return {
      result: items,
      pagination,
    }
  }

  @HttpPost('/')
  async createPost(
    @Body() { authorAlias, ...postProps }: CreatePostReqBody,
  ): Promise<Api.HttpResponseBody<Post>> {
    const author = await this.usersService.getExistingUserByAlias(authorAlias)
    const post = await this.postsService.createPost({ author, ...postProps })

    return {
      result: post,
    }
  }

  @Get('/:postId')
  async getPostById(
    @Param() params: GetPostByIdReqParams,
  ): Promise<Api.HttpResponseBody<Post>> {
    const post = await this.postsService.getExistingPostById(params.postId)

    return {
      result: post,
    }
  }
}
