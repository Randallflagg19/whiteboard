import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { BlocksService, type CreateBlockInput } from './blocks.service.js';

function parseCreateBlock(body: unknown): CreateBlockInput {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException('Body must be an object');
  }

  const input = body as Record<string, unknown>;
  if (typeof input.title !== 'string' || !input.title.trim()) {
    throw new BadRequestException('title must be a non-empty string');
  }
  if (
    input.emoji !== undefined &&
    input.emoji !== null &&
    typeof input.emoji !== 'string'
  ) {
    throw new BadRequestException('emoji must be a string or null');
  }

  let dueDate: Date | null | undefined;
  if (input.dueDate === null) {
    dueDate = null;
  } else if (input.dueDate !== undefined) {
    if (
      typeof input.dueDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)
    ) {
      throw new BadRequestException('dueDate must use YYYY-MM-DD');
    }
    dueDate = new Date(`${input.dueDate}T00:00:00.000Z`);
    if (
      Number.isNaN(dueDate.getTime()) ||
      dueDate.toISOString().slice(0, 10) !== input.dueDate
    ) {
      throw new BadRequestException('dueDate must be a valid date');
    }
  }

  return {
    title: (input.title as string).trim(),
    emoji: input.emoji as string | null | undefined,
    dueDate,
  };
}

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocks: BlocksService) {}

  @Get()
  findAll() {
    return this.blocks.findAll();
  }

  @Post()
  create(@Body() body: unknown) {
    return this.blocks.create(parseCreateBlock(body));
  }
}
