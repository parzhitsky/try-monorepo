import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { type ListPaginated } from '@@shared/pagination/list-paginated.type.js'
import { ClientError } from '@/app/app-error/app-error.js'
import { type PaginationParams } from '@/common/pagination-params.dto.js'
import { type Post } from '@/posts/post.entity.js'
import { type User } from '@/users/user.entity.js'
import { Comment } from './comment.entity.js'

export const GET_COMMENTS_DEFAULT_OFFSET = 0

export const GET_COMMENTS_DEFAULT_LIMIT = 0

/** @private */
interface CreateCommentParams {
  readonly author: User
  readonly post: Post
  readonly content: string
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    protected readonly commentsRepo: Repository<Comment>,
  ) {}

  async getComments({
    offset = GET_COMMENTS_DEFAULT_OFFSET,
    limit = GET_COMMENTS_DEFAULT_LIMIT,
  }: PaginationParams): Promise<ListPaginated<Comment>> {
    const [items, totalCount] = await this.commentsRepo.findAndCount({
      relations: {
        author: true,
      },
      skip: offset,
      take: limit,
    })

    return {
      items,
      pagination: {
        offset,
        limit,
        totalCount,
      },
    }
  }

  async createComment({ author, post, content }: CreateCommentParams): Promise<Comment> {
    const comment = this.commentsRepo.create({ author, post, content })

    await this.commentsRepo.save(comment)

    return comment
  }

  async getExistingCommentById(id: string): Promise<Comment> {
    const comment = await this.commentsRepo.findOne({
      where: { id },
      relations: {
        author: true,
        post: {
          author: true,
        },
      },
    })

    if (comment == null) {
      throw new CommentNotFoundByIdError(id)
    }

    return comment
  }
}

export class CommentNotFoundByIdError extends ClientError {
  public override readonly statusCode = '404'

  constructor(
    public readonly commentId: string,
  ) {
    super(`Comment with id "${commentId}" was not found`)
  }
}
