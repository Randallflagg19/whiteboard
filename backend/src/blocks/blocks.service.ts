import { Injectable } from '@nestjs/common';
import type { BoardBlock } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export type CreateBlockInput = {
  title: string;
  emoji?: string | null;
  dueDate?: Date | null;
};

function toResponse(block: BoardBlock) {
  return {
    id: block.id,
    title: block.title,
    emoji: block.emoji,
    dueDate: block.dueDate?.toISOString().slice(0, 10) ?? null,
    sortOrder: block.sortOrder,
    createdAt: block.createdAt,
    updatedAt: block.updatedAt,
  };
}

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const blocks = await this.prisma.boardBlock.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });
    return blocks.map(toResponse);
  }

  async create(input: CreateBlockInput) {
    const block = await this.prisma.boardBlock.create({ data: input });
    return toResponse(block);
  }
}
