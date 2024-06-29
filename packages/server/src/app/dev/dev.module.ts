import { Module } from '@nestjs/common'
import { DevController } from './dev.controller.js'
import { DevService } from './dev.service.js'

@Module({
  providers: [
    DevService,
  ],
  controllers: [
    DevController,
  ],
})
export class DevModule {}
