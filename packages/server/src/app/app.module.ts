import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common'
import { CommentsModule } from '@/comments/comments.module.js'
import { ConfigModule } from '@/config/config.module.js'
import { DbModule } from '@/db/db.module.js'
import { HealthModule } from '@/health/health.module.js'
import { PostsModule } from '@/posts/posts.module.js'
import { UsersModule } from '@/users/users.module.js'
import { AppErrorFilter } from './app-error/app-error.filter.js'
import { HttpLoggerMiddleware } from './http-logger.middleware.js'
import { HttpRateLimiterMiddleware } from './http-rate-limiter.middleware.js'

@Module({
  imports: [
    ConfigModule,
    DbModule,
    HealthModule,
    CommentsModule,
    PostsModule,
    UsersModule,
  ],
  providers: [
    AppErrorFilter,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(HttpLoggerMiddleware, HttpRateLimiterMiddleware)
      .forRoutes('*')
  }
}
