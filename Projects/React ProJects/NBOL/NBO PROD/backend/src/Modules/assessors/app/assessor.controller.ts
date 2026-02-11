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
import { AssessorsService } from './assessor.service';
import { createAssessors } from '../dto/createAssessorDto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('assessors')
export class AssessorController {
  constructor(private readonly assessorService: AssessorsService) {}

  @Get('download')
  async downloadFile() {
    return this.assessorService.download();
  }

  @Post('upload-excel-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // Store file in memory
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xls|xlsx)$/)) {
          return cb(new Error('Only Excel files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.assessorService.processExcelFile(file);
  }

  @Post('/')
  async createAssesor(@Body() createAssessor: createAssessors) {
    return await this.assessorService.createAssessor(createAssessor);
  }

  @Delete('/:id')
  async deleteAssessor(@Param('id') assessorId: string) {
    return await this.assessorService.deleteAssessor(assessorId);
  }

  @Get('/')
  async getAll(
    @Query('page') page?: number ,
    @Query('limit') limit?: number ,
  ) {
    return await this.assessorService.getAllAssessor(
      page,
      limit,
    );
  }

  @Get('active-assessors')
  async getAllActiveAssessors() {
    return await this.assessorService.getActiveAssessors();
  }

  @Get('/:id')
  async getAssessor(@Param('id') assessorId: string) {
    return await this.assessorService.getAssessor(assessorId);
  }

  @Put('/:id')
  async updateAssessor(
    @Param('id') assessorId: string,
    @Body() updateData: createAssessors,
  ) {
    return await this.assessorService.updateAssessor(assessorId, updateData);
  }

  @Get('assessor-activity/:id')
  async assessorActivity(@Param('id') assessorId: string) {
    return await this.assessorService.assessorActivity(assessorId);
  }

  @Get('assessor-clients/:id')
  async assessorClassAssessors(
    @Param('id') assessorId: string,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.assessorService.assessorsClients(
      assessorId,
      start_date,
      end_date,
      page,
      limit,
    );
  }

  @Get('assessor-client-classes/:client_id/:assessor_id')
  async assessorsClientsClasses(
    @Param('client_id') clientId: string,
    @Param('assessor_id') assessorId: string,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
  ) {
    return await this.assessorService.assessorsClientsClasses(
      clientId,
      assessorId,
      start_date,
      end_date,
    );
  }
}
