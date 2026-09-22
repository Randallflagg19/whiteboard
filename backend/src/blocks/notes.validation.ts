import { BadRequestException } from '@nestjs/common';

export function parseNote(body: unknown): { content: string } {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException('Body must be an object');
  }
  const content = (body as Record<string, unknown>).content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new BadRequestException('content must be a non-empty string');
  }
  return { content: content.trim() };
}
