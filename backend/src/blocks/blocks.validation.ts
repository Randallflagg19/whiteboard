import { BadRequestException } from '@nestjs/common';
import type { CreateBlockInput, UpdateBlockInput } from './blocks.service.js';

function readBody(body: unknown): Record<string, unknown> {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException('Body must be an object');
  }
  return body as Record<string, unknown>;
}

function parseDueDate(value: unknown): Date | null {
  if (value === null) return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new BadRequestException('dueDate must use YYYY-MM-DD');
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new BadRequestException('dueDate must be a valid date');
  }
  return date;
}

function parseFields(input: Record<string, unknown>): UpdateBlockInput {
  const fields: UpdateBlockInput = {};

  if (Object.hasOwn(input, 'title')) {
    if (typeof input.title !== 'string' || !input.title.trim()) {
      throw new BadRequestException('title must be a non-empty string');
    }
    fields.title = input.title.trim();
  }
  if (Object.hasOwn(input, 'emoji')) {
    if (input.emoji !== null && typeof input.emoji !== 'string') {
      throw new BadRequestException('emoji must be a string or null');
    }
    fields.emoji = input.emoji;
  }
  if (Object.hasOwn(input, 'dueDate')) {
    fields.dueDate = parseDueDate(input.dueDate);
  }

  return fields;
}

export function parseCreateBlock(body: unknown): CreateBlockInput {
  const fields = parseFields(readBody(body));
  if (!fields.title) {
    throw new BadRequestException('title must be a non-empty string');
  }
  return { ...fields, title: fields.title };
}

export function parseUpdateBlock(body: unknown): UpdateBlockInput {
  const fields = parseFields(readBody(body));
  if (Object.keys(fields).length === 0) {
    throw new BadRequestException('Provide title, emoji, or dueDate');
  }
  return fields;
}
