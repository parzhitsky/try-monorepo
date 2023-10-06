import { Body, Controller, Get, Post as HttpPost, Param } from '@nestjs/common'
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
  async getPosts(): Promise<Api.HttpResponseBody<Post[]>> {
    const posts = await this.postsService.getPosts()

    return {
      result: posts,
    }
  }

  @HttpPost('/')
  async createPost(
    @Body() body: CreatePostReqBody,
  ): Promise<Api.HttpResponseBody<Post>> {
    const author = await this.usersService.getExistingUserByAlias(body.authorAlias)
    const post = await this.postsService.createPost({ author, content: body.content })

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
