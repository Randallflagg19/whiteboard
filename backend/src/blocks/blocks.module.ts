import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller.js';
import { BlocksService } from './blocks.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  controllers: [BlocksController],
  providers: [BlocksService, PrismaService],
})
export class BlocksModule {}
