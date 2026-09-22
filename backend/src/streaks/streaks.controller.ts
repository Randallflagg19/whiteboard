import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { StreaksService } from './streaks.service.js';
import { parseCreateStreak, parseDate, parseResult } from './streaks.validation.js';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaks: StreaksService) {}

  @Get()
  findAll(@Query('from') from: string, @Query('to') to: string) {
    return this.streaks.findAll(parseDate(from), parseDate(to));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('from') from: string, @Query('to') to: string) {
    return this.streaks.findOne(id, parseDate(from), parseDate(to));
  }

  @Post()
  create(@Body() body: unknown) {
    return this.streaks.create(parseCreateStreak(body));
  }

  @Put(':id/entries/:date')
  mark(@Param('id') id: string, @Param('date') date: string, @Body() body: unknown) {
    return this.streaks.mark(id, parseDate(date), parseResult(body));
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.streaks.delete(id);
  }
}
