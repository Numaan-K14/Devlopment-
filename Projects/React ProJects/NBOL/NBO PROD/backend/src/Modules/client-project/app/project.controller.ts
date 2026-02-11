import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { createProject } from '../dto/createProject.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/:id')
  async createProject(
    @Param('id') clientId: string,
    @Body() projectData: createProject,
  ) {
    return await this.projectService.createProject(clientId, projectData);
  }

  @Get('/:id')
  async getProject(@Param('id') projectId: string) {
    return await this.projectService.getsingleProject(projectId);
  }

  @Get('client-projects/:clientId')
  async getclientAllProjects(
    @Param('clientId') clientId: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query() search: any,
  ) {
    return await this.projectService.getclientAllProjects(clientId,
      Number(page),
      Number(limit),
    );
  }

  @Put('/:id')
  async updateProject(
    @Param('id') projectId: string,
    @Body() projectData: createProject,
  ) {
    return await this.projectService.updateProject(projectId, projectData);
  }

  @Delete('/:id')
  async deleteProject(@Param('id') projectId: string) {
    return await this.projectService.deleteProject(projectId);
  }

  @Get('/')
  async getAllProjects(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return await this.projectService.getAllProjectsAll(
      Number(page),
      Number(limit),
    );
  }

  @Get('client-lead-level/:id')
  async getClientLeadLevel(
    @Param('id') clientId: string
  ){
    return await this.projectService.clientleadLevel(clientId)
  }
}
