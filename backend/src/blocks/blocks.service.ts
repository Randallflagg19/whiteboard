import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { BoardBlock } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export type CreateBlockInput = {
  title: string;
  emoji?: string | null;
  dueDate?: Date | null;
  scheduledFor?: Date | null;
  periodStart?: Date | null;
  periodEnd?: Date | null;
};

export type UpdateBlockInput = Partial<CreateBlockInput>;

function toResponse(block: BoardBlock) {
  return {
    id: block.id,
    title: block.title,
    emoji: block.emoji,
    dueDate: block.dueDate?.toISOString().slice(0, 10) ?? null,
    scheduledFor: block.scheduledFor?.toISOString().slice(0, 10) ?? null,
    periodStart: block.periodStart?.toISOString().slice(0, 10) ?? null,
    periodEnd: block.periodEnd?.toISOString().slice(0, 10) ?? null,
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

  async findOne(id: string) {
    const block = await this.prisma.boardBlock.findUnique({ where: { id } });
    if (!block) throw new NotFoundException('Block not found');
    return toResponse(block);
  }

  async create(input: CreateBlockInput) {
    this.validateDates(input);
    const block = await this.prisma.boardBlock.create({ data: input });
    return toResponse(block);
  }

  async update(id: string, input: UpdateBlockInput) {
    const existing = await this.prisma.boardBlock.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Block not found');
    this.validateDates({ ...existing, ...input });
    const block = await this.prisma.boardBlock.update({
      where: { id },
      data: input,
    });
    return toResponse(block);
  }

  async delete(id: string) {
    return this.prisma.$transaction(async (transaction) => {
      const block = await transaction.boardBlock.findUnique({ where: { id } });
      if (!block) throw new NotFoundException('Block not found');

      await transaction.task.deleteMany({ where: { blockId: id } });
      await transaction.boardBlock.delete({ where: { id } });
      return { deleted: true };
    });
  }

  private validateDates(input: UpdateBlockInput) {
    const modes = Number(Boolean(input.dueDate)) + Number(Boolean(input.scheduledFor)) + Number(Boolean(input.periodStart || input.periodEnd));
    if (modes > 1) throw new BadRequestException('Choose only one block date type');
    if (Boolean(input.periodStart) !== Boolean(input.periodEnd)) {
      throw new BadRequestException('periodStart and periodEnd must be set together');
    }
    if (input.periodStart && input.periodEnd && input.periodStart > input.periodEnd) {
      throw new BadRequestException('periodEnd must be on or after periodStart');
    }
  }
}
