import { Module, forwardRef } from '@nestjs/common'
import { DbModule } from '@/db/db.module.js'
import { PostsModule } from '@/posts/posts.module.js'
import { Purchase } from './purchase.entity.js'
import { PurchasesService } from './purchases.service.js'
import { User } from './user.entity.js'
import { UsersController } from './users.controller.js'
import { UsersService } from './users.service.js'

@Module({
  imports: [
    DbModule.forFeature([User, Purchase]),
    forwardRef(() => PostsModule),
  ],
  providers: [
    UsersService,
    PurchasesService,
  ],
  controllers: [
    UsersController,
  ],
  exports: [
    UsersService,
  ],
})
export class UsersModule {}
