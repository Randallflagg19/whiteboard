import { BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../generated/prisma/client.js';
import type {
  CreateTaskInput,
  TaskFilters,
  UpdateTaskInput,
} from './tasks.service.js';

function readBody(body: unknown): Record<string, unknown> {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException('Body must be an object');
  }
  return body as Record<string, unknown>;
}

function parseDate(value: unknown, field: string): Date | null {
  if (value === null) return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new BadRequestException(`${field} must use YYYY-MM-DD`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new BadRequestException(`${field} must be a valid date`);
  }
  return date;
}

function parseFields(input: Record<string, unknown>): UpdateTaskInput {
  const fields: UpdateTaskInput = {};

  if (Object.hasOwn(input, 'title')) {
    if (typeof input.title !== 'string' || !input.title.trim()) {
      throw new BadRequestException('title must be a non-empty string');
    }
    fields.title = input.title.trim();
  }
  if (Object.hasOwn(input, 'note')) {
    if (input.note !== null && typeof input.note !== 'string') {
      throw new BadRequestException('note must be a string or null');
    }
    fields.note = input.note;
  }
  if (Object.hasOwn(input, 'status')) {
    if (
      typeof input.status !== 'string' ||
      !Object.values(TaskStatus).includes(input.status as TaskStatus)
    ) {
      throw new BadRequestException(
        'status must be AVAILABLE, WAITING, SOMEDAY, or DONE',
      );
    }
    fields.status = input.status as TaskStatus;
  }
  for (const key of ['isInbox', 'isImportant', 'isPinned'] as const) {
    if (Object.hasOwn(input, key)) {
      if (typeof input[key] !== 'boolean') {
        throw new BadRequestException(`${key} must be a boolean`);
      }
      fields[key] = input[key];
    }
  }
  for (const key of ['scheduledFor', 'periodStart', 'periodEnd'] as const) {
    if (Object.hasOwn(input, key)) {
      fields[key] = parseDate(input[key], key);
    }
  }
  if (Object.hasOwn(input, 'sortOrder')) {
    if (
      typeof input.sortOrder !== 'number' ||
      !Number.isInteger(input.sortOrder) ||
      input.sortOrder < -2147483648 ||
      input.sortOrder > 2147483647
    ) {
      throw new BadRequestException('sortOrder must be a 32-bit integer');
    }
    fields.sortOrder = input.sortOrder;
  }
  if (Object.hasOwn(input, 'blockId')) {
    if (input.blockId === null) {
      fields.blockId = null;
    } else if (typeof input.blockId === 'string' && input.blockId.trim()) {
      fields.blockId = input.blockId.trim();
    } else {
      throw new BadRequestException(
        'blockId must be a non-empty string or null',
      );
    }
  }

  return fields;
}

export function parseCreateTask(body: unknown): CreateTaskInput {
  const fields = parseFields(readBody(body));
  if (!fields.title) {
    throw new BadRequestException('title must be a non-empty string');
  }
  return { ...fields, title: fields.title };
}

export function parseUpdateTask(body: unknown): UpdateTaskInput {
  const fields = parseFields(readBody(body));
  if (Object.keys(fields).length === 0) {
    throw new BadRequestException('Provide at least one task field');
  }
  return fields;
}

export function parseTaskFilters(query: Record<string, unknown>): TaskFilters {
  const filters: TaskFilters = {};
  if (Object.hasOwn(query, 'blockId')) {
    if (typeof query.blockId !== 'string' || !query.blockId.trim()) {
      throw new BadRequestException('blockId must be a non-empty string');
    }
    filters.blockId = query.blockId.trim();
  }
  if (Object.hasOwn(query, 'isInbox')) {
    if (query.isInbox !== 'true' && query.isInbox !== 'false') {
      throw new BadRequestException('isInbox must be true or false');
    }
    filters.isInbox = query.isInbox === 'true';
  }
  return filters;
}
