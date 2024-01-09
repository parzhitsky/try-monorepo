import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { PaginationParams } from '@/common/pagination-params.dto.js'
import { PostsService } from '@/posts/posts.service.js'
import { UsersService } from '@/users/users.service.js'
import { type Comment } from './comment.entity.js'
import { CommentsService } from './comments.service.js'
import { CreateCommentReqBody } from './create-comment-req-body.dto.js'
import { GetCommentByIdReqParams } from './get-comment-by-id-req-params.dto.js'

@Controller('comments')
export class CommentsController {
  constructor(
    protected readonly commentsService: CommentsService,
    protected readonly postsService: PostsService,
    protected readonly usersService: UsersService,
  ) {}

  @Get('/')
  async getComments(
    @Query() { offset, limit }: PaginationParams,
  ): Promise<Api.HttpResponseBodyListPaginated<Comment>> {
    const { items, pagination } = await this.commentsService.getComments({ offset, limit })

    return {
      result: items,
      pagination,
    }
  }

  @Post('/')
  async createComment(
    @Body() body: CreateCommentReqBody,
  ): Promise<Api.HttpResponseBody<Comment>> {
    const author = await this.usersService.getExistingUserByAlias(body.authorAlias)
    const post = await this.postsService.getExistingPostById(body.postId)
    const comment = await this.commentsService.createComment({ author, post, content: body.content })

    return {
      result: comment,
    }
  }

  @Get('/:commentId')
  async getCommentById(
    @Param() params: GetCommentByIdReqParams,
  ): Promise<Api.HttpResponseBody<Comment>> {
    const comment = await this.commentsService.getExistingCommentById(params.commentId)

    return {
      result: comment,
    }
  }
}