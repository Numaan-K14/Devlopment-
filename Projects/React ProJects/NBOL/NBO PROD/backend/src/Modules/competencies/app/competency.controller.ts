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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CompetencyService } from './competency.service';
import { createCompetency } from '../dto/create_competency.dto';
import { createCompWeightage } from '../dto/competency_weightage.dto';

@Controller('competency')
export class CompetencyController {
  constructor(private readonly competencyService: CompetencyService) {}

  @Get('download')
  async downloadFile() {
    return this.competencyService.download();
  }

  @Post('upload-excel-file/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xls|xlsx)$/)) {
          return cb(new Error('Only Excel files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadExcel(
    @Param('id') clientId: string,
    @Body('nbol_id') nbolId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.competencyService.processExcelFile(
      clientId,
      nbolId,
      file,
    );
  }

  @Post('/:id')
  async createCompetency(
    @Body('client_id') clientId: string,
    @Param('id') nbolId: string,
    @Body() createCompetency: createCompetency,
  ) {
    return await this.competencyService.createCompetency(
      clientId,
      nbolId,
      createCompetency,
    );
  }

  @Get('/')
  async getAllCompetency() {
    return await this.competencyService.getAllCompetency();
  }

  @Get('nbol-levels-competency/:id')
  async getNbol(@Param('id') nbolId: string) {
    return await this.competencyService.getCompetency(nbolId);
  }

  @Put('/:id')
  async updateCompetency(
    @Param('id') competencyId: string,
    @Body() createCompetency: createCompetency,
  ) {
    return await this.competencyService.updateCompetency(
      competencyId,
      createCompetency,
    );
  }

  @Get('single-competency/:id')
  async getSingleCompetency(@Param('id') competencyId: string) {
    return await this.competencyService.getSingleCompetency(competencyId);
  }

  @Get('client-competency/:id')
  async userAllCompetency(@Param('id') clientId: string) {
    return await this.competencyService.userAllCompetency(clientId);
  }

  @Get('nbol-leadership-level-nbol-filter/:id')
  async getAllLevelsCompetencyfilter(
    @Param('id') nbolId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query() search: any,
  ) {
    return await this.competencyService.getLeadLevelsCompetencyfilter(
      nbolId,
      Number(page),
      Number(limit),
    );
  }

  @Get('participant-dashboard/:id/:clinet_id')
  async getAllParticipantDashboardData(
    @Param('id') partId: string,
    @Param('clinet_id') clientId: string,
  ) {
    return await this.competencyService.getAllParticipantDashboardData(
      partId,
      clientId,
    );
  }

  @Get('nbol-lead-proj-comp/:project_id')
  async getNbolLeadComp(
    @Param('project_id') projectId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.competencyService.getNbolLeadComp(
      projectId,
      Number(page),
      Number(limit),
    );
  }

  @Get('client-lead-level-comp/:client_id')
  async clientLeadLeavelComp(
    @Param('client_id') clientId: string,
    // @Param('nbol_id') nbolId: string,
  ) {
    return await this.competencyService.clientLeadLeavelComp(clientId);
  }

  @Get('nbol-leadership-level-nbol-client-filter/:id/:client_id')
  async getAllLevelsLeadershipfilter(
    @Param('id') nbolId: string,
    @Param('client_id') clientId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.competencyService.getAllLevelsLeadershipClientfilter(
      nbolId,
      clientId,
      Number(page),
      Number(limit),
    );
  }

  @Delete('/:id')
  async deleteCompetency(@Param('id') competencyId: string) {
    return await this.competencyService.deleteCompetency(competencyId);
  }

  @Post('add-nbol-competency-to-client/:nbol_id/:client_id')
  async addNbolCompetencyToClientCompetency(
    @Param('nbol_id') nbolId: string,
    @Param('client_id') client_id: string,
    @Body('competency_id') competencyId: Array<string>,
  ) {
    return await this.competencyService.addNbolCompetencyToClientCompetency(
      nbolId,
      client_id,
      competencyId,
    );
  }

  @Post('nbol-client-competency/:nbol_id/:client_id')
  async addNbolCompTOClient(
    @Param('nbol_id') nbolId: string,
    @Param('client_id') client_id: string,
    @Body('ref_nbol_compt_id') competencyIds: string[],
  ) {
    return await this.competencyService.addNbolCompToClient(
      nbolId,
      client_id,
      competencyIds,
    );
  }
  // class configration
  @Get('client-all-competencies/:client_id')
  async clientAllCompetency(
    @Param('client_id') clientId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.competencyService.clientAllCompetency(
      clientId,
      Number(page),
      Number(limit),
    );
  }

  @Get('get-nbol-competency')
  async getAllCompe() {
    return await this.competencyService.getAllComp();
  }

  @Post('competency-weightage/:client_id/:project_id/:cohort_id')
  async create(
    @Param('client_id') client_id: string,
    @Param('project_id') project_id: string,
    @Param('cohort_id') cohort_id: string,
    @Body() dto: createCompWeightage,
  ) {
    return this.competencyService.createCompetencyWeightages(
      client_id,
      project_id,
      cohort_id,
      dto,
    );
  }

  @Get('get-comp-assessments-weightage/:clientId/:cohortId')
  async getAssessmCompWeightage(
    @Param('clientId') clientId: string,
    @Param('cohortId') cohortId: string,
  ) {
    return await this.competencyService.getAssessmCompWeightage(
      clientId,
      cohortId,
    );
  }

  @Get('test/:clientId/:cohortId')
  async test(
    @Param('clientId') clientId: string,
    @Param('cohortId') cohortId: string,
  ) {
    return await this.competencyService.test(clientId, cohortId);
  }

  @Get('update-comp/:clientId/:projectId/:cohortId')
  async updateNbolCompToCompyComp(
    @Param('clientId') clientId: string,
    @Param('projectId') projectId: string,
    @Param('cohortId') cohortId: string,
  ) {
    return await this.competencyService.updateNbolCompToCompyComp(
      clientId,
      projectId,
      cohortId,
    );
  }

  @Post('copy-cohort-assessments/:cohort_id/:new_cohort_id')
  async copyCohortAssemWeightage(
    @Param('cohort_id') cohort_id: string,
    @Param('new_cohort_id') new_cohort_id: string,
  ) {
    return await this.competencyService.copyCohortAssemWeightage(
      cohort_id,
      new_cohort_id,
    );
  }
}
