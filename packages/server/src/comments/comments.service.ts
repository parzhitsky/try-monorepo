import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClientError } from '@/app/app-error/app-error.js'
import { type Post } from '@/posts/post.entity.js'
import { type User } from '@/users/user.entity.js'
import { Comment } from './comment.entity.js'

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

  async getComments(): Promise<Comment[]> {
    const comments = await this.commentsRepo.find({
      relations: {
        author: true,
      },
    })

    return comments
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
