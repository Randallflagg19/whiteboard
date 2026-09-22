import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller.js';
import { BlocksService } from './blocks.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotesController } from './notes.controller.js';
import { NotesService } from './notes.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [BlocksController, NotesController],
  providers: [BlocksService, NotesService],
})
export class BlocksModule {}
