import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CbiService } from './cbi.service';
import { SubmitAnswerDto } from '../dto/cbi.dto';
import { UpdateCbiReportDto } from '../dto/updateCbiReport.dto';

@Controller('cbi')
export class CbiController {
  constructor(private readonly cbiService: CbiService) {}
  @Post()
  async submitAnswer(@Body() submitAnswerDto: SubmitAnswerDto) {
    return await this.cbiService.submitAnswer(submitAnswerDto);
  }

  @Get('dashboard')
  async dashboardData() {
    return await this.cbiService.dashboardData();
  }

  @Get('participant-data-filter')
  async participantsFilter(
    @Query('client_id') clientId?: string,
    @Query('project_id') projectId?: string,
    @Query('cohort_id') cohortId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.cbiService.participantsFilter(
      clientId,
      projectId,
      cohortId,
      page,
      limit,
    );
  }

  @Get('get-participant-report/:participant_id')
  async getParticipantReportData(
    @Param('participant_id') participant_id: string,
  ) {
    return await this.cbiService.getParticipantReportData(participant_id);
  }

  @Get('report/:questionnaire_id/:participant_id')
  async generateReportData(
    @Param('questionnaire_id') questionnaire_id: string,
    @Param('participant_id') participant_id: string,
  ) {
    return await this.cbiService.generateReportData(
      questionnaire_id,
      participant_id,
    );
  }

  @Get('report-data/:participant_id')
  async getReportData(@Param('participant_id') participant_id: string) {
    return await this.cbiService.getReportData(participant_id);
  }

  @Get('participant-response-score/:part_id')
  async getPartResponseScore(@Param('part_id') participant_id: string) {
    return await this.cbiService.getPartResponseScore(participant_id);
  }

  @Put('update-participant-report/:part_report_id')
  updateParticipantReport(
    @Param('part_report_id') part_report_id: string,
    @Body() updateCbiReportDto: UpdateCbiReportDto,
  ) {
    return this.cbiService.updateParticipantReport(
      part_report_id,
      updateCbiReportDto,
    );
  }

  @Put(':participant_id/update-final-score')
  updateParticipantFinalScore(
    @Param('participant_id') participant_id: string,
    @Body('cbi_score_submitted') cbi_score_submitted: string,
    @Body('final_score') final_score: any[],
  ) {
    return this.cbiService.updateParticipantFinalScore(
      participant_id,
      cbi_score_submitted,
      final_score,
    );
  }

  @Get('score/:questionnaire_id/:participant_id')
  async getFinalScore(
    @Param('questionnaire_id') questionnaire_id: string,
    @Param('participant_id') participant_id: string,
  ) {
    return await this.cbiService.getFinalScore(
      questionnaire_id,
      participant_id,
    );
  }

  @Put(':questionnaire_id/:participant_id')
  pauseAssessment(
    @Param('questionnaire_id') questionnaire_id: string,
    @Param('participant_id') participant_id: string,
  ) {
    return this.cbiService.pauseAssessment(questionnaire_id, participant_id);
  }

  @Get('participant-assessment/:participant_id/:client_id/:cohort_id')
  async getParticipantAssessment(
    @Param('participant_id') participant_id: string,
    @Param('client_id') clientId: string,
    @Param('cohort_id') cohort_id: string,
  ) {
    return await this.cbiService.getParticipantAssessment(
      participant_id,
      clientId,
      cohort_id,
    );
  }

  @Get(':questionnaire_id/:participant_id')
  async getQuestions(
    @Param('questionnaire_id') questionnaire_id: string,
    @Param('participant_id') participant_id: string,
  ) {
    return await this.cbiService.getQuestions(questionnaire_id, participant_id);
  }
}
