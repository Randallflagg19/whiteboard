import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BlocksService } from './blocks.service.js';
import { parseCreateBlock, parseUpdateBlock } from './blocks.validation.js';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocks: BlocksService) {}

  @Get()
  findAll() {
    return this.blocks.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blocks.findOne(id);
  }

  @Post()
  create(@Body() body: unknown) {
    return this.blocks.create(parseCreateBlock(body));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.blocks.update(id, parseUpdateBlock(body));
  }
}
