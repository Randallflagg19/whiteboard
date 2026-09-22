import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Task, TaskStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export type CreateTaskInput = {
  title: string;
  note?: string | null;
  status?: TaskStatus;
  isInbox?: boolean;
  isImportant?: boolean;
  isPinned?: boolean;
  scheduledFor?: Date | null;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  sortOrder?: number;
  blockId?: string | null;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type TaskFilters = {
  blockId?: string;
  isInbox?: boolean;
};

function toResponse(task: Task) {
  return {
    id: task.id,
    title: task.title,
    note: task.note,
    status: task.status,
    isInbox: task.isInbox,
    isImportant: task.isImportant,
    isPinned: task.isPinned,
    scheduledFor: task.scheduledFor?.toISOString().slice(0, 10) ?? null,
    periodStart: task.periodStart?.toISOString().slice(0, 10) ?? null,
    periodEnd: task.periodEnd?.toISOString().slice(0, 10) ?? null,
    sortOrder: task.sortOrder,
    blockId: task.blockId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureBlockExists(blockId: string) {
    const block = await this.prisma.boardBlock.findUnique({
      where: { id: blockId },
    });
    if (!block) throw new NotFoundException('Block not found');
  }

  async findAll(filters: TaskFilters) {
    const tasks = await this.prisma.task.findMany({
      where: filters,
      orderBy: [{ isPinned: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });
    return tasks.map(toResponse);
  }

  async create(input: CreateTaskInput) {
    this.validateDates(input);
    if (input.blockId) await this.ensureBlockExists(input.blockId);
    const task = await this.prisma.task.create({ data: input });
    return toResponse(task);
  }

  async update(id: string, input: UpdateTaskInput) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Task not found');
    this.validateDates({ ...existing, ...input });
    if (input.blockId) await this.ensureBlockExists(input.blockId);
    const task = await this.prisma.task.update({ where: { id }, data: input });
    return toResponse(task);
  }

  async delete(id: string) {
    const result = await this.prisma.task.deleteMany({ where: { id } });
    if (result.count === 0) throw new NotFoundException('Task not found');
    return { deleted: true };
  }

  private validateDates(input: CreateTaskInput) {
    if (input.scheduledFor && (input.periodStart || input.periodEnd)) {
      throw new BadRequestException('Choose a day or a period');
    }
    if (Boolean(input.periodStart) !== Boolean(input.periodEnd)) {
      throw new BadRequestException('periodStart and periodEnd must be set together');
    }
    if (input.periodStart && input.periodEnd && input.periodStart > input.periodEnd) {
      throw new BadRequestException('periodEnd must be on or after periodStart');
    }
  }
}
