import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { StreaksController } from './streaks.controller.js';
import { StreaksService } from './streaks.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [StreaksController],
  providers: [StreaksService],
})
export class StreaksModule {}
