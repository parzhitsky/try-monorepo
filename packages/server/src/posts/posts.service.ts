import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { type ListPaginated } from '@@shared/pagination/list-paginated.type.js'
import { ClientError } from '@/app/app-error/app-error.js'
import { type PaginationParams } from '@/common/pagination-params.dto.js'
import { type User } from '@/users/user.entity.js'
import { Post } from './post.entity.js'

export const GET_POSTS_DEFAULT_OFFSET = 0

export const GET_POSTS_DEFAULT_LIMIT = 10

/** @private */
interface CreatePostParams {
  readonly author: User
  readonly content: string
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    protected readonly postsRepo: Repository<Post>,
  ) {}

  async createPost({ author, content }: CreatePostParams): Promise<Post> {
    const post = this.postsRepo.create({ author, content })

    await this.postsRepo.save(post)

    return post
  }

  async getPosts({
    offset = GET_POSTS_DEFAULT_OFFSET,
    limit = GET_POSTS_DEFAULT_LIMIT,
  }: PaginationParams): Promise<ListPaginated<Post>> {
    const [items, totalCount] = await this.postsRepo.findAndCount({
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

  async getExistingPostById(id: string): Promise<Post> {
    const post = await this.postsRepo.findOne({
      where: { id },
      relations: {
        author: true,
        comments: {
          author: true,
        },
      },
    })

    if (post == null) {
      throw new PostNotFoundByIdError(id)
    }

    return post
  }
}

export class PostNotFoundByIdError extends ClientError {
  public override readonly statusCode = '404'

  constructor(
    public readonly postId: string,
  ) {
    super(`Post with id "${postId}" was not found`)
  }
}
