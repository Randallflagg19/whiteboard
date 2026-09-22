import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BlocksModule } from './blocks/blocks.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { StreaksModule } from './streaks/streaks.module.js';

@Module({
  imports: [BlocksModule, TasksModule, StreaksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
