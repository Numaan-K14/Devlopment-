import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CohortService } from './cohort.service';
import { CreateCohorts } from '../dto/createCohorts.dto';

@Controller('cohorts')
export class CohortController {
  constructor(private readonly cohortService: CohortService) {}
  @Post('/:id')
  async createCohortt(
    @Param('id') projectId: string,
    @Body() cohortData: CreateCohorts,
  ) {
    return await this.cohortService.createCohort(projectId, cohortData);
  }

  @Get('get-all-cohorts/:projectId')
  async getAllCohorts(@Param('projectId') projectId: string) {
    return await this.cohortService.getAllCohorts(projectId);
  }

  @Delete('delete-cohorts')
  async deleteMultipleCohort(@Body('ids') cohortIDs: string[]) {
    return await this.cohortService.deleteMultipleCohort(cohortIDs);
  }
}
