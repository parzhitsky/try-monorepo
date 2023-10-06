import { Module, forwardRef } from '@nestjs/common'
import { DbModule } from '@/db/db.module.js'
import { PostsModule } from '@/posts/posts.module.js'
import { UsersModule } from '@/users/users.module.js'
import { Comment } from './comment.entity.js'
import { CommentsController } from './comments.controller.js'
import { CommentsService } from './comments.service.js'

@Module({
  imports: [
    DbModule.forFeature([Comment]),
    forwardRef(() => PostsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [
    CommentsService,
  ],
  controllers: [
    CommentsController,
  ],
})
export class CommentsModule {}
