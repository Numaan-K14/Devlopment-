import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NbolService } from './nbolLeadLevel.service';
import { createNbolLevels } from '../dto/nbolDto';

@Controller('nbol-levels')
export class NbolController {
  constructor(private readonly nbolService: NbolService) {}

  @Post('/')
  async createNbol(@Body() createNbol: createNbolLevels) {
    return await this.nbolService.createNbol(createNbol);
  }

  @Get()
  async getAllLeadLevels(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query() search: any,
  ) {
    return await this.nbolService.allLeadLevels(Number(page), Number(limit));
  }

  @Get('/:id')
  async getSingleLevel(@Param('id') nbolId: string) {
    return await this.nbolService.singleLevel(nbolId);
  }

  @Delete('/:id')
  async deleteLevel(@Param('id') nbolId: string) {
    return await this.nbolService.deleteLevel(nbolId);
  }

  @Put('/:id')
  async updateLevel(
    @Param('id') nbolId: string,
    @Body() updateNbolLevel: createNbolLevels,
  ) {
    return await this.nbolService.updateLeadLevel(nbolId, updateNbolLevel);
  }
}
