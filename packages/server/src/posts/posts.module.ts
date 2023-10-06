import { Module, forwardRef } from '@nestjs/common'
import { DbModule } from '@/db/db.module.js'
import { UsersModule } from '@/users/users.module.js'
import { Post } from './post.entity.js'
import { PostsController } from './posts.controller.js'
import { PostsService } from './posts.service.js'

@Module({
  imports: [
    DbModule.forFeature([Post]),
    forwardRef(() => UsersModule),
  ],
  providers: [
    PostsService,
  ],
  controllers: [
    PostsController,
  ],
  exports: [
    PostsService,
  ],
})
export class PostsModule {}
