import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClass } from '../dto/createClass.dto';
import { CreateAssessmentWithResponses } from '../dto/createAssessmentResponse.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAssessmentWithResponsesDto } from '../dto/updateAssessmentResponse.dto';
import { CreateQuessionnaireResponseDto } from '../dto/createAssessmentQuessResp.dto';
import { UpdateQuessionnaireResponseDto } from '../dto/updateAssessQuessResponse.dto';
import { UpdateAssessmentAISummaryDto } from '../dto/updateAI_Summary.dto';
import { CreateDraftDto } from '../dto/createDraft.dto';
import { SchedulingInput, ScheduleResult } from '../dto/scheduling.dto';
import { CreateScheduleDraft } from '../dto/createscheduleDraft.dto';
import { UpdatePartQuessResp } from '../dto/updatePartQuessResponse.dto';
import { CreateQuessRespAssessor } from '../dto/createQuessRespAssessorView.dto';
import { UpdateQuessRespAssessor } from '../dto/updateQuessRespAssessor.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('class-assessment-scenerio/:id')
  async assessmentsScenerio(
    @Param('id') clientId: string,
    @Body('classId') classId: string,
  ) {
    return await this.classService.classAssessmentsScenerio(clientId, classId);
  }

  @Get('class-competency-expected-behaviors/:id')
  async classCompetencyExpected(
    @Param('id') classId: string,
    // @Param('partId') partId: string
  ) {
    return await this.classService.classCompetencyExpected(classId);
  }

  @Get('all-class-schedule')
  async allClassSchedule() {
    return await this.classService.allClassSchedule();
  }

  @Get('class-details/:id')
  async allClassDetails(
    @Param('id') cohortId: string,
    @Query('date') date: string,
  ) {
    return await this.classService.classDetails(cohortId, date);
  }

  @Get('assessor-schedule/:id/:assessor_id')
  async assessorSchedule(
    @Param('id') cohortId: string,
    @Param('assessor_id') assessorId: string,
    @Query('date') date: string,
  ) {
    return await this.classService.assessorSchedule(cohortId, assessorId, date);
  }

  @Get('participant-schedule/:cohort_id')
  async participantSchedule(
    @Param('cohort_id') cohortId: string,
    @Body('participant_id') participantId: string,
    @Body('class_id') classId: string,
    @Query('date') date: string,
  ) {
    return await this.classService.participantSchedule(
      cohortId,
      participantId,
      classId,
      date,
    );
  }

  @Get('class-details-participant/:id/:part_id')
  async classDetailsParticipant(
    @Param('id') clientId: string,
    @Param('part_id') participantId: string,
  ) {
    return await this.classService.classDetailsParticipant(
      clientId,
      participantId,
    );
  }

  @Get('participants-assessments/:id')
  async participantAssessments(
    @Param('id') assessorId: string,
    @Query('client_id') clientId?: string,
    @Query('project_id') projectId?: string,
    @Query('cohort_id') cohortId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.classService.participantAssessments(
      assessorId,
      clientId,
      projectId,
      cohortId,
      Number(page),
      Number(limit),
    );
  }

  @Post('assessment-response')
  @UseInterceptors(FileInterceptor('audio_file'))
  async createAssessmentWithResponses(
    @Body() data: CreateAssessmentWithResponses,
  ): Promise<any> {
    try {
      const result =
        await this.classService.createAssessmentWithResponses(data);
      return {
        success: true,
        message: 'Assessment with responses created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message:
            error.message || 'Failed to create assessment with responses',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('assessment-response-grp-act/')
  async createAssessmentWithResponsesGrpAct(
    // @Body('observation') observation:string,
    @Body() data: CreateAssessmentWithResponses[],
  ): Promise<any> {
    try {
      const result =
        await this.classService.createAssessmentWithResponsesGrpAct(
          // grpActRoomId,
          // observation,
          data,
        );
      return {
        success: true,
        message: 'Assessment with responses created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message:
            error.message || 'Failed to create assessment with responses',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(
    'getassessment-response/:participant_id/:assessment_id/:class_id/:par_ass_id/:assessor_id',
  )
  async getAssessmentResponseT(
    @Param('participant_id') participant_id: string,
    @Param('assessment_id') assessment_id: string,
    @Param('class_id') class_id: string,
    @Param('par_ass_id') par_ass_id: string,
    @Param('assessor_id') assessor_id: string,
    // @Param('assem_resp_id') assem_resp_id: string,
    @Query('assem_resp_id') assem_resp_id?: string,
  ) {
    return await this.classService.getAssessmentWithResponses(
      participant_id,
      assessment_id,
      class_id,
      par_ass_id,
      assessor_id,
      assem_resp_id,
    );
  }

  @Get(
    'getassessment-response-summary/:participant_id/:assessment_id/:par_ass_id',
  )
  async getAssessmentOnlySummary(
    @Param('participant_id') participant_id: string,
    @Param('assessment_id') assessment_id: string,
    @Param('par_ass_id') par_ass_id: string,
  ) {
    return await this.classService.getAssessmentOnlySummary(
      participant_id,
      assessment_id,
      par_ass_id,
    );
  }

  @Get('getassessment-response-grp-act/:grp_act_id/:assessment_id/:class_id')
  async getAssessmentResponseGrp(
    @Param('grp_act_id') grp_act_id: string,
    @Param('assessment_id') assessment_id: string,
    @Param('class_id') class_id: string,
  ) {
    return await this.classService.getAssessmentWithResponsesGrp(
      grp_act_id,
      assessment_id,
      class_id,
    );
  }

  // @Get('getassessment-response/:participant_id/:assessment_id')
  // async getAssessmentResponse(
  //   @Param('participant_id') participant_id: string,
  //   @Param('assessment_id') assessment_id: string,
  // ) {
  //   return await this.classService.getAssessmentWithResponses(
  //     participant_id,
  //     assessment_id,
  //   );
  // }

  @Put('assessment-response/:id')
  async updateAssessmentWithResponses(
    @Param('id') assessmentResponseId: string,
    @Body() data: UpdateAssessmentWithResponsesDto,
  ): Promise<any> {
    try {
      const result = await this.classService.updateAssessmentWithResponses(
        assessmentResponseId,
        data,
      );
      return {
        success: true,
        message: 'Assessment scores updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to update assessment scores',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('assessment-response-grp-act/:id')
  async updateAssessmentWithResponsesGroAct(
    @Param('id') grpActRoom: string,
    // @Body('observation') observation: string,
    @Body() data: UpdateAssessmentWithResponsesDto[],
  ): Promise<any> {
    try {
      const result =
        await this.classService.updateAssessmentWithResponsesGrpAct(
          grpActRoom,
          // observation,
          data,
        );
      return {
        success: true,
        message: 'Assessment scores updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to update assessment scores',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('assessment-response-ai-summary/:id')
  async updateAssessmentAiSummary(
    @Param('id') assessmentResponseId: string,
    @Body('commentary') commentary: string,
    @Body() data: UpdateAssessmentAISummaryDto,
  ): Promise<any> {
    try {
      const result = await this.classService.updateAssessmentAiSummary(
        assessmentResponseId,
        commentary,
        data,
      );
      return {
        success: true,
        message: 'Assessment scores updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to update assessment scores',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('upload-file/:id')
  @UseInterceptors(
    FileInterceptor('audio_file', {
      limits: { fileSize: 200 * 1024 * 1024 },
    }),
  )
  async uploadFile(
    @UploadedFile() audioFile: Express.Multer.File,
    @Param('id') responseId: string,
  ): Promise<any> {
    try {
      const filePath = await this.classService.uploadFile(
        audioFile,
        responseId,
      );
      return {
        success: true,
        message: 'File uploaded successfully',
        filePath,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to upload file',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('client-all-assessmnets-scenerio-quess/:participant_id/:email')
  async getClientAllAssessment(
    @Param('participant_id') participantId: string,
    @Param('email') email: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.classService.getClientSelectedAssessment(
      participantId,
      email,
      Number(page),
      Number(limit),
    );
  }

  @Post('create-quessionnaire-response-assessor')
  async createQuessionnaireResponse(
    // @Param('id') classId: string,
    @Body() data: CreateQuessRespAssessor,
  ): Promise<any> {
    return await this.classService.createQuessionnaireResponses(
      // classId,
      data,
    );
  }

  // @Get('getassessment-quess-response')
  // async getQuessionnaireResponses(@Param('id') particiapntId: string) {
  //   return await this.classService.getQuessionnaireResponses(particiapntId);
  // }

  @Put('update-assessment-quess-response')
  async updateQuessionnaireResponses(
    // @Param('id') assessmentResponseId: string,
    @Body() data: UpdateQuessRespAssessor,
  ): Promise<any> {
    try {
      const result = await this.classService.updateQuessionnaireResponses(
        // assessmentResponseId,
        data,
      );
      return {
        success: true,
        message: 'Assessment scores updated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Put('assessor-quess-response')
  // async assessorQuessResponse(
  //   // @Param('id') quessionnaireResponseId: string,
  //   @Body() data: UpdateQuessionnaireResponseDto,
  // ): Promise<any> {
  //   try {
  //     const result = await this.classService.assessorQuessResponse(
  //       // quessionnaireResponseId,
  //       data,
  //     );
  //     return {
  //       success: true,
  //       message: 'Assessment scores updated successfully',
  //       data: result,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         success: false,
  //         message: error.message || 'Failed to update assessment scores',
  //       },
  //       error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
  //=========================================
  // @Post('/:id/:cohortId')
  // async createClass(
  //   @Param('id') clientId: string,
  //   @Param('cohortId') cohortId: string,
  //   @Body() createClass: CreateClass,
  // ) {
  //   return await this.classService.createClass(clientId, cohortId, createClass);
  // }

  @Post('/:id/:cohortId')
  async updatedCreateClass(
    @Param('id') clientId: string,
    @Param('cohortId') cohortId: string,
    @Body() createClass: CreateClass,
  ) {
    return await this.classService.updatedCreateClass(
      clientId,
      cohortId,
      createClass,
    );
  }

  @Post('pre-schedule/:client_id/:cohort_id')
  async preClassSchedule(
    @Param('client_id') clientId: string,
    @Param('cohort_id') cohortId: string,
    @Body() createClass: CreateClass,
  ) {
    return await this.classService.preClassSchedule(
      clientId,
      cohortId,
      createClass,
    );
  }

  @Put('start-assessment/:participant_id/:assessment_id')
  async startAssessment(
    @Param('participant_id') participantId: string,
    @Param('assessment_id') assessmentId: string,
  ) {
    return await this.classService.startAssessment(participantId, assessmentId);
  }

  @Get('get-participant-comp-exp/:id')
  async getPartCompetencyExpectedBehaviours(@Param('id') responseId: string) {
    return await this.classService.getPartCompExpBehaviours(responseId);
  }

  @Put('update-ques-comp-id/:id')
  async updateQuesComp(
    @Param('id') clientId: string,
    @Body('quessionnaireIds') quesionnaireId: string[],
  ) {
    return await this.classService.updateQuessComp(clientId, quesionnaireId);
  }

  @Post('class-draft')
  async createDraft(@Body() createDarft: CreateDraftDto) {
    return await this.classService.draftClass(createDarft);
  }

  @Get('get-classdraft-data/:id')
  async getdraftClass(@Param('id') id: string) {
    return await this.classService.getdraftClass(id);
  }

  @Get('get-all-draftclass')
  async participantsFilter(
    @Query('client_id') clientId?: string,
    @Query('project_id') projectId?: string,
    @Query('cohort_id') cohortId?: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.classService.getAllDraftClass(
      clientId,
      projectId,
      cohortId,
      Number(page),
      Number(limit),
    );
  }

  @Delete('delete-draftclass/:id')
  async deleteDraftClass(
    @Param('id') id: string,
    @Param('delete_business_case') delete_business_case: boolean,
   ) {
    return await this.classService.deleteDraftClass(id, delete_business_case);
  }

  //  @Delete('test')
  // async test(
  // ) {
  //   return await this.classService.test();
  // }

  @Get('assessor-classess-schedule/:id')
  async assessorClassesDetails(@Param('id') assessorId: string) {
    return await this.classService.assessorClassesDetails(assessorId);
  }

  @Get('part-class-schedule/:id')
  async partClass(@Param('id') partId: string) {
    return await this.classService.partClass(partId);
  }

  @Post('update-commentary')
  async callPostLambda(
    @Body('assessment_id') assessmentId: string,
    @Body('commentary') commentary: string,
  ) {
    return await this.classService.callPostLambda(assessmentId, commentary);
  }

  @Get(':cohortId/cohort-assessments')
  async cohortAssessments(@Param('cohortId') cohortId: string) {
    return await this.classService.cohortAssessments(cohortId);
  }

  @Get(':cohortId/cohort-assesm-scenerio')
  async cohortAssessmScenerio(@Param('cohortId') cohortId: string) {
    return await this.classService.cohortAssessmScenerio(cohortId);
  }

  @Post(':clientId/:cohortId/auto-schedule')
  async generateAutomaticSchedule(
    @Param('clientId') clientId: string,
    @Param('cohortId') cohortId: string,
    @Body() schedulingInput: SchedulingInput,
  ): Promise<ScheduleResult> {
    try {
      return await this.classService.generateAutomaticSchedule(
        clientId,
        cohortId,
        schedulingInput,
      );
    } catch (error) {
      // If it's already an HttpException (like capacity validation errors), re-throw as-is
      if (error instanceof HttpException) {
        throw error;
      }

      // Handle validation errors and other errors with proper status codes
      if (error.statusCode === 500 || error.errors) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
            errors: error.errors || [error.message],
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // For other errors, wrap in HttpException with 500 status
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('schedule-draft')
  async scheduledraft(
    @Body() data: CreateScheduleDraft,
  ): Promise<ScheduleResult> {
    return this.classService.scheduledraft(data);
  }

  @Get('get-all-schedule-draft')
  async getAllscheduleDraft(
    @Query('client_id') clientId?: string,
    @Query('project_id') projectId?: string,
    @Query('cohort_id') cohortId?: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.classService.getAllscheduleDraft(
      clientId,
      projectId,
      cohortId,
      Number(page),
      Number(limit),
    );
  }

  @Get('getsingle-schedule-draft/:cohortId')
  async getdraftSchedule(@Param('cohortId') cohortId: string) {
    return await this.classService.getdraftSchedule(cohortId);
  }

  @Get('assessor-conflict')
  async checkAssessorAvailability(
    @Body('assessorId') assessorIds: string,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
    @Body('date') date: Date,
    @Body('transaction') transaction: any,
  ) {
    return await this.classService.checkAssessorAvailability(
      assessorIds,
      startTime,
      endTime,
      date,
      transaction,
    );
  }

  @Get('date/:id')
  async findDayWiseAssessm(
    @Param('id') cohortId: string,
    @Query('date') date: string,
  ) {
    return await this.classService.dayFilterSchedule(cohortId, date);
  }

  @Get('part-quess-resp/:id')
  async getPartQuessReponse(@Param('id') id: string) {
    return await this.classService.getPartQuessReponse(id);
  }

  @Put('update-part-quess-resp')
  async updatePartRersp(@Body() data: UpdatePartQuessResp) {
    return await this.classService.updatePartRersp(data);
  }

  @Post('create-quess-response')
  async createQuessionnaireResponsesPart(
    @Body() data: CreateAssessmentWithResponses,
  ) {
    return await this.classService.createQuessionnaireResponsesPart(data);
  }

  @Put('upload-ppt')
  @UseInterceptors(
    FileInterceptor('ppt', {
      storage: diskStorage({
        destination: './public/business_case_ppt/',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadLogo(
    @Body('id') id: string,
    @Body('is_uploaded') is_uploaded: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const pptPath = file ? `/public/business_case_ppt/${file.filename}` : null;
    return await this.classService.uploadPpt(id, pptPath, is_uploaded);
  }
}
