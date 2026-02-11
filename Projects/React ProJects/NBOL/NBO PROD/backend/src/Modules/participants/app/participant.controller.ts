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
  Res,
  Search,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ParticipantService } from './participant.service';
import { createParticipants } from '../dto/createParticipants';
import { updateParticipants } from '../dto/updateParticiapnts';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  // @Get('download')participant-filter
  // async downloadFile() {
  //   return this.participantService.download();
  // }

  @Get('download/:clientId/:nbolId/:projectId')
  async download(
    // @Res() res: Response,
    @Param('clientId') clientId: string,
    @Param('nbolId') nbolId: string,
    @Param('projectId') projectId: string,
  ) {
    // const { fileName, buffer } =
    //   await this.participantService.download(clientId);

    // res.set({
    //   'Content-Type':
    //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   'Content-Disposition': `attachment; filename=${fileName}`,
    // });

    // res.send(buffer);
    return this.participantService.download(clientId, nbolId, projectId);
  }

  @Post('upload-excel-file/:clientId/:projectId/:cohortId')
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
    @Param('clientId') clientId: string,
    @Param('projectId') projectId: string,
    @Param('cohortId') cohortId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.participantService.processExcelFile(
      clientId,
      projectId,
      cohortId,
      file,
    );
  }

  @Get('get-participant-jobgrades/:clientId/:nbolId/:projectId')
  async getPartJobGrades(
    @Param('clientId') clientId: string,
    @Param('nbolId') nbolId: string,
    @Param('projectId') projectId: string,
  ) {
    return await this.participantService.partJobGrade(
      clientId,
      nbolId,
      projectId,
    );
  }

  @Post('/:id')
  async createParticipant(
    @Param('id') client_id: string,
    // @Param('projectId',  ) projectId: string,
    @Body() createParticipant: createParticipants,
  ) {
    return await this.participantService.createParticipant(
      client_id,
      // projectId,
      createParticipant,
    );
  }

  // @Get('/:id')
  // async getAllClientParticipants(
  //   // @Param('id') projectId: string,
  //   @Query('clientId') clientId: string,
  //   @Query('cohortId') cohortId: string,
  //   @Query('page') page: number = 0,
  //   @Query('limit') limit: number = 10,
  // ) {
  //   return await this.participantService.clientAllParticipants(
  //     clientId,
  //     cohortId,
  //     Number(page),
  //     Number(limit),
  //   );
  // }

  @Get('participant-filter')
  async participantsFilter(
    @Query('client_id') clientId?: string,
    @Query('project_id') projectId?: string,
    @Query('cohort_id') cohortId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.participantService.participantsFilter(
      clientId,
      projectId,
      cohortId,
      page,
      limit,
    );
  }

  @Get('getparticipant/:id')
  async getParticipant(@Param('id') partId: string) {
    return await this.participantService.getParticipant(partId);
  }
  @Put('update-particiapnt/:id')
  async updatepart(
    @Param('id') particiapntId: string,
    @Body() body: updateParticipants,
  ) {
    return await this.participantService.updateParticipant(particiapntId, body);
  }

  @Delete('/:id')
  async deleteParticipant(@Param('id') participantId: string) {
    return await this.participantService.deleteParticipant(participantId);
  }

  @Get('get-project-cohorts/:id')
  async getProjectCohorts(@Param('id') projectId: string) {
    return await this.participantService.getProjectCohorts(projectId);
  }

  @Get('/')
  async getAllParticipants(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query() search: any,
  ) {
    return await this.participantService.getAllParticipants(
      Number(page),
      Number(limit),
    );
  }

  @Get('test')
  async test() {
    return await this.participantService.test();
  }

   @Get('export-participants-data')
  async export(
    @Query('client_id') clientId: string,
    @Query('project_id') projectId: string,
    @Query('cohort_id') cohortId: string,
    @Res() res: Response,
  ) {
    return await this.participantService.exportParticipantsData(
      clientId,
      projectId,
      cohortId,
      res,
    );
  }
}
