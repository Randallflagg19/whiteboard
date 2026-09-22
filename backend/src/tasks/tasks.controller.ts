import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import {
  parseCreateTask,
  parseTaskFilters,
  parseUpdateTask,
} from './tasks.validation.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.tasks.findAll(parseTaskFilters(query));
  }

  @Post()
  create(@Body() body: unknown) {
    return this.tasks.create(parseCreateTask(body));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.tasks.update(id, parseUpdateTask(body));
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasks.delete(id);
  }
}
