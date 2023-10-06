import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClientError } from '@/app/app-error/app-error.js'
import { type User } from '@/users/user.entity.js'
import { Post } from './post.entity.js'

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

  async getPosts(): Promise<Post[]> {
    const posts = await this.postsRepo.find({
      relations: {
        author: true,
      },
    })

    return posts
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
