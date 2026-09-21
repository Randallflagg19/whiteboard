import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BlocksModule } from './blocks/blocks.module.js';

@Module({
  imports: [BlocksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
