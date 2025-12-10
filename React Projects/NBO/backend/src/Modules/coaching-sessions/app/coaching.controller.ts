import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CoachingService } from './coaching.service';
import { createCoachingSessions } from '../dto/createCoachingDto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { commentStatus } from '../model/coaching.model';

@Controller('coaching')
export class CoachingController {
  constructor(private readonly coachingService: CoachingService) {}

  @Post('/')
  async createCoachingSession(@Body() createCoaching: createCoachingSessions) {
    return await this.coachingService.createCoachingSession(createCoaching);
  }

  @Get('/')
  async getAllSessions() {
    return await this.coachingService.getAllCoschingSessions();
  }

  @Get(':id')
  async getSingleSessio(@Param('id') id: string) {
    return await this.coachingService.getSingleSession(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<createCoachingSessions>,
  ) {
    return await this.coachingService.updateCoachingSession(id, dto);
  }

  @Delete(':id')
  async deleteSession(@Param('id') id: string) {
    return await this.coachingService.deleteSession(id);
  }

  @Get('assessor-sessions/:id')
  async assessorSessions(
    @Param('id') id: string,
    @Query('client_id') clientId: string,
    @Query('project_id') projectId: string,
    @Query('cohort_id') cohortId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.coachingService.assessorSessions(
      id,
      clientId,
      projectId,
      cohortId,
      Number(page),
      Number(limit),
    );
  }

  @Put('session-comment/:id')
  async addComment(
    @Param('id') id: string,
    @Body('comment') comment: string,
    @Body('is_draft') isDraft: commentStatus,
  ) {
    if (!Object.values(commentStatus).includes(isDraft)) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: `Invalid commentStatus value: ${isDraft}`,
      });
    }
    try {
      return await this.coachingService.addComment(id, comment, isDraft);
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: error.message,
      });
    }
  }

  @Get('particpant-session/:part_id')
  async partSessionCommView(@Param('part_id') participantId: string) {
    return await this.coachingService.partSessionCommView(participantId);
  }

  @Get('report-generated-particpants/:cohort_id')
  async getAllParticipants(@Param('cohort_id') cohort_id: string) {
    return await this.coachingService.getAllRepoGenParticipants(cohort_id);
  }
}
