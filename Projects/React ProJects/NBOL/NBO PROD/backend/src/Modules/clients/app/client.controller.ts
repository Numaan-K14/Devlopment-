import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { createClient } from '../dto/createClient.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('search')
  async search(@Query() search: any) {
    return await this.clientService.search();
  }

  @Get('nbol-360-clients/')
  async getNbolClient() {
    return await this.clientService.getNbol_360_Clients();
  }

  @Post('/')
  async createClient(@Body() createClientDto: createClient) {
    return await this.clientService.createClient(createClientDto);
  }

  @Post('upload-logo')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './public/uploads/logos/',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadLogo(
    @Body('client_id') client_id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const logoPath = file ? `/public/uploads/logos/${file.filename}` : null;
    return await this.clientService.logoUpload(logoPath, client_id);
  }

  @Get('/')
  async getAllClients(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    // @Query() search: any,
  ) {
    return await this.clientService.getAllClients(Number(page), Number(limit));
  }

  @Get('getall-clients')
  async getall(@Query() search: any) {
    return await this.clientService.getAllClientsnoLimit();
  }

  @Get('client-project/:id')
  async clientProject(@Param('id') clientId: string) {
    return await this.clientService.getProjectsofClient(clientId);
  }

  @Put('/:id')
  async updateClient(
    @Param('id') clientId: string,
    @Body() updateData: createClient,
  ) {
    return await this.clientService.updateClient(clientId, updateData);
  }

  @Get('/:id')
  async getClient(@Param('id') clientId: string) {
    return this.clientService.getClient(clientId);
  }

  @Get('all-clients')
  async allClients() {
    return await this.clientService.allClients();
  }

  @Delete('/:id')
  async deleteClient(@Param('id') clientId: string) {
    return this.clientService.deleteClient(clientId);
  }

  @Get('associate-clients/:id')
  async getAssociateCompanies(@Param('id') id: string) {
    return await this.clientService.getAssociateCompanies(id);
  }
}
