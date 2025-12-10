import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FacilityService } from './facility.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { createFacility } from '../dto/createFacility';
import { UpdateFacility } from '../dto/updateFacility';

@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  // @Post('generate')
  // async generateExcel() {
  //   this.facilityService.createExcelFile();
  //   const data = this.facilityService.createExcelFile();
  //   return {
  //     data: data,
  //   };
  // }

  // @Get('download')
  // getFileChangingResponseObjDirectly(
  //   @Res({ passthrough: true }) res: Response,
  // ): StreamableFile {
  //   const data = this.facilityService.createExcelFile();

  //   const file = createReadStream(
  //     join(process.cwd(), data.fiel_path),
  //   );

  //   res.set({
  //     'Content-Type':
  //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     'Content-Disposition': 'attachment; filename= "facility_data.xlsx"',
  //   });
  //   return new StreamableFile(file);
  // }

  @Get('download')
  async downloadFile() {
    return this.facilityService.download();
  }

  @Post('upload-excel-file/:id')
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
    @Param('id') clientId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.facilityService.processExcelFile(clientId, file);
  }

  @Post('/:id')
  async createFacility(
    @Param('id') clientId: string,
    @Body() facilityData: createFacility,
  ) {
    return await this.facilityService.createFacility(clientId, facilityData);
  }

  @Put('/:id')
  async updateFacility(
    @Param('id') facility_id: string,
    @Body() updateFacility: UpdateFacility,
  ) {
    return await this.facilityService.updateFacility(
      facility_id,
      updateFacility,
    );
  }

  @Get('/:id')
  async allFacility(
    @Param('id') clientId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query() search: any,
  ) {
    return await this.facilityService.clientAllFacilities(
      clientId,
      Number(page),
      Number(limit),
    );
  }

  @Delete('/:id')
  async deleteFacility(@Param('id') facilityId: string) {
    return await this.facilityService.deleteFacility(facilityId);
  }

  @Get('facility-rooms/:id')
  async facilityRooms(@Param('id') facilityId: string) {
    return await this.facilityService.faciityRooms(facilityId);
  }

  @Delete('delete-room/:id')
  async deleteRoom(@Param('id') roomId: string) {
    return await this.facilityService.deleteRoom(roomId);
  }
}
