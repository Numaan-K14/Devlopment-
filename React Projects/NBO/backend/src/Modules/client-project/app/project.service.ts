import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Projects } from '../project.model';
import { createProject } from '../dto/createProject.dto';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { UpdateProject } from '../dto/updateproject.dto';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import { ClientRoles } from 'src/Modules/client-roles-levels/model/role.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Projects)
    private projectModel: typeof Projects,

    @InjectModel(NbolLeadLevels)
    private nbolLeadLevelModel: typeof NbolLeadLevels,

    @InjectModel(Class)
    private classModel: typeof Class,

    private readonly requestParams: RequestParamsService,
  ) {}

  async clientleadLevel(clientId: string): Promise<any> {
    const leadLevel = await this.nbolLeadLevelModel.findAll({
      include: [
        {
          model: ClientRoles,
          as: 'roles',
          attributes: [],
          where: {
            client_id: clientId,
          },
        },
      ],
    });
    if (!leadLevel || leadLevel.length === 0) {
      const leadLevel = await this.nbolLeadLevelModel.findAll();
      return leadLevel;
    }
    return leadLevel;
  }

  async createProject(
    clientId: string,
    projectData: createProject,
  ): Promise<any> {
    const existingProject = await this.projectModel.findOne({
      where: {
        project_name: projectData.project_name.trim(),
        client_id: clientId,
      },
    });

    if (existingProject) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: `Project With This Name Already Exists For This Client`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // const project = await this.projectModel.create({
    //   project_name: projectData.project_name,
    //   client_id: clientId,
    //   start_date: new Date(projectData.start_date),
    //   end_date: new Date(projectData.end_date),
    //   nbol_ll_id: projectData.nbol_ll_id,
    // } as Projects);
    // return project;
    return await this.projectModel.create(projectData as unknown as Projects);
  }

  async getsingleProject(projectId: string): Promise<any> {
    const project = await this.projectModel.findOne({
      where: {
        id: projectId,
      },
      include: [
        {
          model: NbolLeadLevels,
          as: 'nbol',
        },
        {
          model: Clients,
          as: 'client',
        },
      ],
    });
    if (!project) {
      throw new HttpException(
        {
          message: 'Project Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return project;
  }

  async updateProject(
    projectId: string,
    updateProject: UpdateProject,
  ): Promise<any> {
    const project = await this.projectModel.findByPk(projectId);
    if (project?.project_name != updateProject.project_name) {
      const existingProject = await this.projectModel.findOne({
        where: {
          project_name: updateProject.project_name.trim(),
          client_id: updateProject.client_id,
        },
      });

      if (existingProject) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: `Project With This Name Already Exists For This Client`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (!project) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: `Project Not Found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedProject = await project.update({
      project_name: updateProject.project_name,
      start_date: new Date(updateProject.start_date),
      end_date: new Date(updateProject.end_date),
      nbol_ll_id: updateProject.nbol_ll_id,
    } as unknown as Projects);
    return updatedProject;
  }

  async deleteProject(projectId: string): Promise<any> {
    const classProject = await this.projectModel.findAll({
      include: [
        {
          model: Cohorts,
          as: 'cohorts',
          where: {
            project_id: projectId,
          },
          required: true,
          include: [
            {
              model: this.classModel,
              as: 'class',
              required: true,
            },
          ],
        },
      ],
    });

    if (classProject.length > 0) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: `Deletion Failed: There Is An Active CLASS Linked For This Project And Cannot Be Deleted`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const project = await this.projectModel.findByPk(projectId);

    if (!project) {
      throw new HttpException(
        {
          message: `Project Not Found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await project.destroy();
    return {
      message: `Project Deleted Successfully`,
    };
  }

  async getclientAllProjects(
    clientId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;
    const projects = await this.projectModel.findAll({
      where: {
        client_id: clientId,
        ...getSearchObject(this.requestParams.query, [
          'project_name',
          'client_name',
          'leadership_level',
        ]),
      },
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: NbolLeadLevels,
          as: 'nbol',
        },
        {
          model: Clients,
          as: 'client',
        },
      ],
    });
    if (!projects) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: `Projects Not Found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      rows: projects,
      count: await this.projectModel.count({
        where: {
          client_id: clientId,
        },
      }),
      page: page,
    };
  }

  async getAllProjectsAll(page: number = 0, limit: number = 10): Promise<any> {
    const offset = page * limit;
    const record = await this.projectModel.count();

    const projects = await this.projectModel.findAll({
      where: {
        ...getSearchObject(this.requestParams.query, [
          'project_name',
          'client_name',
          'leadership_level',
        ]),
      },
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: NbolLeadLevels,
          as: 'nbol',
        },
        {
          model: Clients,
          as: 'client',
        },
      ],
    });
    return {
      rows: projects,
      count: record,
      page: page,
    };
  }
}
