import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { UpdateClassPartReportAndAvgCompDto } from '../dto/updateReportAIData.dto';
import { UpdateFinalScore } from '../dto/updateFinalScore.dto';
import { updateScenerioSummary } from '../dto/updateScenerioSummary.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('participant-details/:id')
  async participantDetails(@Param('id') participantId: string) {
    return await this.reportService.singleParticipantReport(participantId);
  }

  @Get('ai-details/:id')
  async participantAI(@Param('id') participantId: string) {
    return await this.reportService.participantAI(participantId);
  }

  @Put('update-report-ai-data/:id')
  async updateReportAIData(
    @Param('id') participantId: string,
    @Body() updateReportAIDataDto: UpdateClassPartReportAndAvgCompDto,
  ) {
    return await this.reportService.updateClassPartReportAndAvgComp(
      participantId,
      updateReportAIDataDto,
    );
  }

  @Get('all-participant-report/:id')
  async participantParticipant(@Param('id') clientId: string) {
    return await this.reportService.allParticipantReport(clientId);
  }

  // @Get('avg-comp-score/:id')
  // async averageCompScore(@Param('id') participantId: string) {
  //   return await this.reportService.averageCompScore(participantId);
  // }

  @Post('avg-comp-score/:id/:classId')
  async averageCompScoreTest(
    @Param('id') participantId: string,
    @Param('classId') classId: string,
  ) {
    return await this.reportService.averageCompScoreTest1(
      participantId,
      classId,
    );
  }

  @Get('all-class-reports')
  async getAllPartReport(
    @Query('clientId') clientId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query() search: any,
  ) {
    return await this.reportService.getAllPartReport(
      clientId,
      Number(page),
      Number(limit),
    );
  }

  @Get('all-class-reports-part/:id')
  async getPartReportOfClass(
    @Param('id') classId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.reportService.getPartReportOfClass(
      classId,
      Number(page),
      Number(limit),
    );
  }

  @Post('admin-status/:id')
  async updateAdminStatus(
    @Param('id') participantId: string,
    @Body('admin_status') adminStatus: string,
    @Body('admin_name') adminName: string,
  ) {
    return await this.reportService.adminReportStatus(
      participantId,
      adminStatus,
      adminName,
    );
  }

  @Get('report-download/:id')
  async reportDownload(@Param('id') participantId: string) {
    return await this.reportService.getSingleResponseReport(participantId);
  }

  @Get('participant-scorecard')
  async cohortPartScoreCardData(
    @Query('client_id') clientId?: string,
    @Query('project_id') projectId?: string,
    @Query('cohort_id') cohortId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.reportService.cohortPartScoreCardData(
      clientId,
      projectId,
      cohortId,
      Number(page),
      Number(limit),
    );
  }

  @Get('participant-Assessments-score/:client_id/:cohort_id/:part_id')
  async getPartAllAssessmentsMarks(
    @Param('client_id') clientId: string,
    @Param('cohort_id') cohortId: string,
    @Param('part_id') partId: string,
  ) {
    return await this.reportService.getPartAllAssessmentsMarks(
      clientId,
      cohortId,
      partId,
    );
  }

  @Put('assessor-final-score')
  async finalAssessorScore(@Body() data: UpdateFinalScore) {
    return await this.reportService.finalAssessorScore(data);
  }

  @Get('class-assessment/:cohort_id')
  async getscenerioSummary(@Param('cohort_id') cohort_id: string) {
    return await this.reportService.getscenerioSummary(cohort_id);
  }

  @Put('class-assesssment-summary')
  async updateAssessmSummary(@Body() data: updateScenerioSummary) {
    return await this.reportService.updateAssessmSummary(data);
  }

  @Get('cohort-comp-average/:class_id/:cohort_id')
  async cohortAvgCompScore(
    @Param('class_id') class_id: string,
    @Param('cohort_id') cohort_id: string,
  ) {
    return await this.reportService.cohortAvgCompScore(class_id, cohort_id);
  }

  @Get('part-assessment-responses/:part_id')
  async participantAssessments_Report_view(
    @Param('part_id') part_id: string,
    @Query('page') page: number = 0,
    @Param('limit') limit: number = 10,
  ) {
    return await this.reportService.participantAssessments_Report_view(
      part_id,
      Number(page),
      Number(limit),
    );
  }

  @Get('assessment-assessor')
  async assessmAssessors(
    @Query('part_assesm_id') part_assem_id: string,
    @Query('grp_act_id') grp_act_id: string,
  ) {
    return await this.reportService.assessmAssessors(part_assem_id, grp_act_id);
  }

  @Get('single-assesm-response/:resp_id')
  async getResp_of_single_assesm(
    @Param('resp_id') resp_id: string,
    // @Query('page') page: number = 0,
    // @Param('limit') limit: number = 10,
  ) {
    return await this.reportService.getResp_of_single_assesm(
      resp_id,
      // Number(page),
      // Number(limit),
    );
  }
}
