import { BadRequestException } from '@nestjs/common';

export type CreateStreakInput = { emoji: string; title: string | null; showTitle: boolean };
export type StreakResultInput = 'SUCCESS' | 'MISSED';

function readBody(body: unknown): Record<string, unknown> {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException('Body must be an object');
  }
  return body as Record<string, unknown>;
}

export function parseDate(value: unknown): Date {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new BadRequestException('date must use YYYY-MM-DD');
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new BadRequestException('date must be valid');
  }
  return date;
}

export function parseCreateStreak(body: unknown): CreateStreakInput {
  const input = readBody(body);
  if (typeof input.emoji !== 'string' || !input.emoji.trim()) {
    throw new BadRequestException('emoji is required');
  }
  if (input.title !== undefined && input.title !== null && typeof input.title !== 'string') {
    throw new BadRequestException('title must be a string or null');
  }
  if (input.showTitle !== undefined && typeof input.showTitle !== 'boolean') {
    throw new BadRequestException('showTitle must be a boolean');
  }
  return {
    emoji: input.emoji.trim(),
    title: typeof input.title === 'string' ? input.title.trim() || null : null,
    showTitle: input.showTitle === undefined ? true : input.showTitle,
  };
}

export function parseResult(body: unknown): StreakResultInput {
  const result = readBody(body).result;
  if (result !== 'SUCCESS' && result !== 'MISSED') {
    throw new BadRequestException('result must be SUCCESS or MISSED');
  }
  return result;
}
