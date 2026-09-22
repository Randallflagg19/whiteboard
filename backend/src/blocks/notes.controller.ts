import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NotesService } from './notes.service.js';
import { parseNote } from './notes.validation.js';

@Controller('blocks/:blockId/notes')
export class NotesController {
  constructor(private readonly notes: NotesService) {}

  @Get()
  findAll(@Param('blockId') blockId: string) {
    return this.notes.findAll(blockId);
  }

  @Post()
  create(@Param('blockId') blockId: string, @Body() body: unknown) {
    return this.notes.create(blockId, parseNote(body).content);
  }

  @Patch(':id')
  update(@Param('blockId') blockId: string, @Param('id') id: string, @Body() body: unknown) {
    return this.notes.update(blockId, id, parseNote(body).content);
  }

  @Delete(':id')
  delete(@Param('blockId') blockId: string, @Param('id') id: string) {
    return this.notes.delete(blockId, id);
  }
}
