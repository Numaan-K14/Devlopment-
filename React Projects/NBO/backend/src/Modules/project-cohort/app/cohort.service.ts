import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cohorts } from '../model/cohort.model';
import { createCompetency } from 'src/Modules/competencies/dto/create_competency.dto';
import { CreateCohorts } from '../dto/createCohorts.dto';
import { Class } from 'src/Modules/class-configration/model/class.model';

@Injectable()
export class CohortService {
  constructor(
    @InjectModel(Cohorts)
    private readonly cohortModel: typeof Cohorts,
  ) {}

  async createCohort(
    projectId: string,
    cohortData: CreateCohorts,
  ): Promise<any> {
    // if (!projectId) {
    //   throw new HttpException(
    //     {
    //       status: 400,
    //       succcess: false,
    //       message: 'Project not Found, please select project',
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    const existingProject = await this.cohortModel.findOne({
      where: {
        cohort_name: cohortData.cohort_name,
        project_id: projectId,
      },
    });

    if (existingProject) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: `Cohort with name ${cohortData.cohort_name} already exists for this Project`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const newCohort = await this.cohortModel.create({
      cohort_name: cohortData.cohort_name,
      project_id: projectId,
    } as Cohorts);
    return {newCohort, message: 'Cohort created successfully' };
  }

  async getAllCohorts(projectId: string): Promise<any> {
    const cohorts = await this.cohortModel.findAll({
      where: {
        project_id: projectId,
      },
    });
    if (!cohorts) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: `No cohorts found for project with ID ${projectId}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      rows: cohorts,
    };
  }

  async deleteMultipleCohort(cohortIds: string[]): Promise<any> {
    const cohorts = await this.cohortModel.findAll({
      where: {
        id: cohortIds,
      },
    });

    if (!cohorts || cohorts.length === 0) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: `No cohorts found for the provided IDs`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const activeClasses = await Class.findAll({
      where: {
        cohort_id: cohortIds,
      },
    });

    if (activeClasses && activeClasses.length > 0) {
      throw new HttpException(
        {
          message:
            'Deletion Failed: There Are Active CLASSES Linked For These Cohorts And Cannot Be Deleted',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.cohortModel.destroy({
      where: {
        id: cohortIds,
      },
    });
    return {
      message: `Cohorts deleted successfully`,
    };
  }
}
