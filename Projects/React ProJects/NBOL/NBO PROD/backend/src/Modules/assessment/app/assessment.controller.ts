import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { createAssessment } from '../dto/create-assessment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createScenerio } from '../dto/create-scenerio.dto';
import * as multer from 'multer';
import { CreateQuessionnaireDto } from '../dto/quesionnaire.dto';
import { CreateClassAssessments } from 'src/Modules/class-configration/dto/createParticAssessments.dto';
import { createClientAssessment } from '../dto/createClientAssessment.dto';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  // @Get('download')
  // async downloadFile() {
  //   return this.assessmentService.download();
  // }

  @Get('download/:clientId')
  async download(@Param('clientId') clientId: string) {
    return this.assessmentService.downloadQuestionsWithCompetencyDropdown(
      clientId,
    );
  }

  @Put('update-assessments-quessionnaire/:client_id/:cohort_id')
  async updateClientAssessmentsQuess(
    @Param('client_id') clientId: string,
    @Param('cohort_id') cohortId: string,
    @Body() createClientAssessment: createClientAssessment,
  ) {
    return await this.assessmentService.updateClientAssessmentsBulk(
      clientId,
      cohortId,
      createClientAssessment,
    );
  }

  @Post('convert-to-html')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const htmlContent = await this.assessmentService.convertPdfToHtml(
      file.buffer,
    );
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
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
    @Param('id') assessmentId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.assessmentService.processExcelFile(assessmentId, file);
  }

  //-----

  @Post('convert-excel-to-html/:client_id')
  @UseInterceptors(FileInterceptor('file'))
  async convertExcelToHtml(
    @UploadedFile() file: Express.Multer.File,
    @Param('client_id') clientId: string,
  ): Promise<any> {
    const result = await this.assessmentService.convertExcelToHtml(
      file.buffer,
      clientId,
    );
    return result;
  }

  @Post('create-quessionnaire/:id')
  async createQuessionnaire(
    @Param('id') assessmentId: string,
    @Body() createQuessionnaireDto: CreateQuessionnaireDto,
  ): Promise<any> {
   
      return await this.assessmentService.createQuessionnaire(
        assessmentId,
        createQuessionnaireDto,
      );
  }

  @Get('all-quesionnaire/:id/:cohort_id/:assessment_id')
  async getAllQuesionnaire(
    @Param('id') projectId: string,
    @Param('cohort_id') cohortId: string,
    @Param('assessment_id') assessmentId: string,
  ) {
    return await this.assessmentService.getAllQuessionnaires(
      projectId,
      cohortId,
      assessmentId,
    );
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadPdf(@UploadedFile() file: Express.Multer.File): Promise<string> {
  //   const filePath = file.path;
  //   const htmlContent = await this.assessmentService.parsePdfToHtml(filePath);
  //   return htmlContent;
  // }

  @Post('/')
  async createAssessment(@Body() createAssessment: createAssessment) {
    return await this.assessmentService.createAssessment(createAssessment);
  }

  // @Post('add-scenerio/:id')
  // async createScenerio(
  //   @Param('id') assessmentId: string,
  //   @Body() createScenerio: createScenerio,
  // ) {
  //   return await this.assessmentService.createScenerio(
  //     assessmentId,
  //     createScenerio,
  //   );
  // }

  @Post('add-scenerio/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.pdf$/)) {
          return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createScenerio(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') assessmentId: string,
    @Body() createScenerio: createScenerio,
  ) {
    return await this.assessmentService.createScenerio(
      file?.buffer,
      assessmentId,
      createScenerio,
    );
  }

  @Get('client-assessments/:id') // -----updated(status)
  async getClientAssessment(
    // @Param('id') clientId: string,
    @Param('id') cohortId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query() search: any,
  ) {
    return await this.assessmentService.getClientAssessment(
      // clientId,
      cohortId,
      Number(page),
      Number(limit),
    );
  }

  
  @Get('assessment-selected-scenerios/:assessment_id/:cohort_id')
  async getClientSelctedScenerios(
    @Param('assessment_id') assessmentId: string,
    @Param('cohort_id') cohortId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.assessmentService.getClientSelctedScenerios(
      assessmentId,
      cohortId,
      page,
      limit,
    );
  }

  
  @Get('assessment-scenerio/:id')
  async assessmentScenerio(
    @Param('id') assessmentId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.assessmentService.assessmentScenerio(
      assessmentId,
      Number(page),
      Number(limit),
    );
  }

  @Delete('delete-scenerio/:id')
  async deleteScenerio(@Param('id') scenerioId: string) {
    return await this.assessmentService.deleteScenerio(scenerioId);
  }

  @Put('scenerio/:id')
  async updateScenerio(
    @Param('id') scenerioId: string,
    @Body() updateScenerio: createScenerio,
  ) {
    return await this.assessmentService.updateScenerio(
      scenerioId,
      updateScenerio,
    );
  }

  // @Post('add-assessments-scenerio/:client_id/:cohort_id')
  // async addClientAssessments(
  //   @Param('client_id') clientId: string,
  //   @Param('cohort_id') cohortId: string,
  //   @Body('assessment_id') assessmentId: string,
  //   @Body('scenerio_id') scenerioId: string,
  //   @Body('quesionnaire_id') questionnairId: string,
  // ) {
  //   return await this.assessmentService.addClientAssessments(
  //     clientId,
  //     cohortId,
  //     assessmentId,
  //     scenerioId,
  //     questionnairId,
  //   );
  // }

  @Post('add-assessments-scenerio/:client_id/:cohort_id')
  async addClientAssessments(
    @Param('client_id') clientId: string,
    @Param('cohort_id') cohortId: string,
    @Body() dto: createClientAssessment,
  ) {
    return await this.assessmentService.addClientAssessmentsNew(
      clientId,
      cohortId,
      dto,
    );
  }

  @Get('single-assessment-scenrios/:id')
  async getSingleAssessmentScenerio(
    @Param('id') assessmentId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.assessmentService.getSingleAssessmentScenerio(
      assessmentId,
      Number(page),
      Number(limit),
    );
  }

  // @Put('update-assessments-quessionnaire/:client_id/:cohort_id') // update it
  // async updateClientAssessmentsQuess(
  //   @Param('client_id') clientId: string,
  //   @Param('cohort_id') cohortId: string,
  //   @Body('assessment_id') assessmentId: string,
  //   @Body() updateData: { scenerio_id?: string; quesionnaire_id?: string },
  // ) {
  //   const { scenerio_id, quesionnaire_id } = updateData;
  //   return await this.assessmentService.updateClientAssessments(
  //     clientId,
  //     cohortId,
  //     assessmentId,
  //     scenerio_id,
  //     quesionnaire_id,
  //   );
  // }

  @Delete('delete-client-assessment/:clientId/:cohortId/:assessmentId')
  async deleteClientAssessment(
    @Param('clientId') clientId: string,
    @Param('cohortId') cohortId: string,
    @Param('assessmentId') assessmentId: string,
  ): Promise<any> {
    const result = await this.assessmentService.deleteClientAssessment(
      clientId,
      cohortId,
      assessmentId,
    );
    return result;
  }

  @Get('client-assessments-scenerio/:id')
  async clientAssessmentsScenerio(
    @Param('id') clientId: string,
    // @Param('cohort_id') cohort_id: string,
  ) {
    return await this.assessmentService.clientAssessmentsScenerio(
      clientId,
      // cohort_id,
    );
  }

  @Get(
    'client-assessments-quessionnaire/:id/:cohort_id/:part_id/:assm_id/:par_ass_id/:quessionaire_id/:assessor_id',
  )
  async getClientQuesionnaire(
    @Param('id') clientId: string,
    @Param('cohort_id') cohortId: string,
    @Param('part_id') participantId: string,
    @Param('assm_id') assessmentId: string,
    @Param('par_ass_id') par_ass_id: string,
    @Param('quessionaire_id') quessionaire_id: string,
    @Param('assessor_id') assessor_id: string,
    @Query('assem_resp_id') assem_resp_id: string,
  ) {
    return await this.assessmentService.getClientQuesionnaire(
      clientId,
      cohortId,
      participantId,
      assessmentId,
      par_ass_id,
      quessionaire_id,
      assessor_id,
      assem_resp_id,
    );
  }

  @Get('client-all-assessmnets-scenerio-quess/:id')
  async getClientAllAssessment(
    @Param('id') clientId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.assessmentService.getClientSelectedAssessment(
      clientId,
      Number(page),
      Number(limit),
    );
  }

  @Get()
  async getAllAssessment() {
    return await this.assessmentService.getAllAssessments();
  }

  @Get('class-configration-details/:id/:cohort_Id')
  async clientAssessmentsAllDetails(
    @Param('id') clientId: string,
    @Param('cohort_Id') cohortId: string,
  ) {
    return await this.assessmentService.clientAssessmentsAllDetails(
      clientId,
      cohortId,
    );
  }

  // @Get('assessment-scenerio-pdf/:client_id/:assessment_id')
  // async getAssessmentScenerioPdf(
  //   @Param('client_id') clientId: string,
  //   @Param('assessment_id') assessmentId: string,
  // ){
  //   return await this.assessmentService.participantAssessmentPdf(
  //     clientId,
  //     assessmentId,
  //   );
  // }

  //   @Get('part-quess-resp/:id')
  // async getPartQuessReponse(
  //   @Param('id') id: string
  // ) {
  //   return await this.assessmentService.getPartQuessReponse(id);
  // }

  @Post('copy-cohort-assessments/:cohort_id/:new_cohort_id')
  async copyCohortAssessments(
    @Param('cohort_id') cohort_id: string,
    @Param('new_cohort_id') new_cohort_id: string,
  ) {
    return await this.assessmentService.copyCohortAssessments(cohort_id, new_cohort_id);
  }
}
