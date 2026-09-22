import { Injectable, NotFoundException } from '@nestjs/common';
import type { BlockNote } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

function toResponse(note: BlockNote) {
  return {
    id: note.id,
    content: note.content,
    blockId: note.blockId,
    sortOrder: note.sortOrder,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureBlock(blockId: string) {
    const block = await this.prisma.boardBlock.findUnique({ where: { id: blockId } });
    if (!block) throw new NotFoundException('Block not found');
  }

  async findAll(blockId: string) {
    await this.ensureBlock(blockId);
    const notes = await this.prisma.blockNote.findMany({
      where: { blockId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });
    return notes.map(toResponse);
  }

  async create(blockId: string, content: string) {
    await this.ensureBlock(blockId);
    const note = await this.prisma.blockNote.create({ data: { blockId, content } });
    return toResponse(note);
  }

  async update(blockId: string, id: string, content: string) {
    const existing = await this.prisma.blockNote.findFirst({ where: { id, blockId } });
    if (!existing) throw new NotFoundException('Note not found');
    const note = await this.prisma.blockNote.update({ where: { id }, data: { content } });
    return toResponse(note);
  }

  async delete(blockId: string, id: string) {
    const result = await this.prisma.blockNote.deleteMany({ where: { id, blockId } });
    if (result.count === 0) throw new NotFoundException('Note not found');
    return { deleted: true };
  }
}
