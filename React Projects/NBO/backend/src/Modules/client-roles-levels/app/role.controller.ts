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
import { RoleService } from './role.service';
import { ResponseInterceptor } from 'src/common/interceptors';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CreateRole } from '../dto/role.dto';

@Controller('client-role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('download')
  async downloadFile() {
    return this.roleService.download();
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
    @Body('nbol_id') nbolId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.roleService.processExcelFile(clientId, nbolId, file);
  }

  @Post('/:id')
  @UseInterceptors(ResponseInterceptor)
  async createRole(
    @Param('id') clientId: string,
    @Body('role') role: string[],
    @Body('nbolId') nbolId: string,
  ) {
    return await this.roleService.createRoles(clientId, role, nbolId);
  }
  
  // @Post('role-copy/:id')
  // @UseInterceptors(ResponseInterceptor)
  // async createRoleCopy(
  //   @Body() roleData: CreateRole,
  // ) {
  //   return await this.roleService.createRoles_copy(roleData);
  // }

  @Get('/:id')
  async getAllLevels(
    @Param('id') clientId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query() search: any,
  ) {
    return await this.roleService.getAllLevels(
      clientId,
      Number(page),
      Number(limit),
    );
  }

  @Get('update-level/:levelId')
  async getsLevel(@Param('levelId') levelId: string) {
    return await this.roleService.getLevel(levelId);
  }

  @Put('/id')
  async updateRoles(
    @Param('id') clientId: string,
    @Body('role') role: string[],
    @Body('nbolId') nbolId: string,
  ) {
    return await this.roleService.updateRoles(clientId, role, nbolId);
  }

  @Delete('/:id')
  async deleteRole(@Param('id') levelId: string) {
    return await this.roleService.deleteLevel(levelId);
  }
}
