import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientRoles } from '../model/role.model';
import { InjectModel } from '@nestjs/sequelize';
import { Attributes, CreationAttributes, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as XLSX from 'xlsx';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { CreateRole } from '../dto/role.dto';
import { RequestParamsService } from 'src/Modules/requestParams';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { Participants } from 'src/Modules/participants/model/participants.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(ClientRoles)
    private roleModel: typeof ClientRoles,

    @InjectModel(Participants)
    private partModel: typeof Participants,

    private sequelize: Sequelize,

    private readonly requestParams: RequestParamsService,
  ) {}

  // async createRoles(clientId: number, role: string, nbolId: number){
  //     const roles = await this.roleModel.create({
  //         clientId: clientId,
  //         role : role,
  //         nbolId: nbolId
  //     }as Roles)

  //     return{
  //         roles
  //     }
  // }

  download() {
    try {
      const fileName = 'client_role_levels_data.xlsx';
      return {
        fileName,
        filePath: 'public/excel/client_role_levels_data.xlsx',
      };
    } catch (error) {
      throw new Error(`Failed to download Excel file: ${error.message}`);
    }
  }

  async processExcelFile(
    clientId: string,
    nbolId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!nbolId) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Select Leadership Level',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!jsonData || jsonData.length === 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Excel File Is Empty No Valid Roles Found.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const normalizedData = jsonData.map((item) => ({
        role: item['Roles'],
      }));

      let createData = normalizedData?.map((item) => {
        return { ...item, client_id: clientId, nbol_id: nbolId };
      });

      await this.roleModel.bulkCreate(
        createData as CreationAttributes<ClientRoles>[],
      );

      return 'Excel Data Uploaded Successfully!';
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: `${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createRoles(client_id: string, roles: string[], nbol_id: string) {
    const existingRoles = await this.roleModel.findOne({
      where: {
        client_id: client_id,
        role: {
          [Op.in]: roles.map((role) => role.trim()),
        },
      },
    });
    if (existingRoles) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Role Alredy Exists For This Client',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const roleRecords: CreationAttributes<ClientRoles>[] = roles.map(
      (role): CreationAttributes<ClientRoles> =>
        ({
          client_id: client_id,
          role: role,
          nbol_id: nbol_id,
        }) as CreationAttributes<ClientRoles>,
    );

    const createdRoles = await this.roleModel.bulkCreate(roleRecords, {
      validate: true,
    });

    return createdRoles;
  }

  // async createRoles_copy(roleData: CreateRole) {
  //   const existingRoles = await this.roleModel.findOne({
  //     where: {
  //       client_id: roleData.client_id,
  //       role: {
  //         [Op.in]: roleData.roles.map((roleObj) => roleObj.role),
  //       },
  //     },
  //   });
  //   if (existingRoles) {
  //     throw new HttpException(
  //       {
  //         status: 400,
  //         success: false,
  //         message: 'Role alredy exist for this Client',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const roleRecords = roleData.roles.map(
  //     (roleObj): CreationAttributes<ClientRoles> =>
  //       ({
  //         client_id: roleData.client_id,
  //         role: roleObj.role,
  //         // role: roleObj,
  //         nbol_id: roleData.nbol_id,
  //       }) as unknown as CreationAttributes<ClientRoles>,
  //   );
  //   const createdRoles = await this.roleModel.bulkCreate(roleRecords, {
  //     validate: true,
  //   });

  //   return createdRoles;
  // }

  async getLevel(levelId: string): Promise<any> {
    const level = await this.roleModel.findByPk(levelId);
    return level;
  }

  async updateRoles(client_id: string, roles: string[], nbol_id: string) {
    return await this.sequelize.transaction(async (transaction) => {
      const partJobGrade = await this.partModel.findAll({
        where: {
          job_grade: nbol_id,
        },
      });
      if (partJobGrade.length > 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message:
              'This Job Grade Is Assigned To a Participant Therefor You Can Not Update It',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.roleModel.destroy({
        where: { client_id, nbol_id },
        transaction,
      });

      const roleRecords: CreationAttributes<ClientRoles>[] = roles.map(
        (role): CreationAttributes<ClientRoles> =>
          ({
            client_id,
            role,
            nbol_id,
          }) as CreationAttributes<ClientRoles>,
      );

      return await this.roleModel.bulkCreate(roleRecords, {
        validate: true,
        transaction,
      });
    });
  }

  async deleteLevel(levelId: string): Promise<any> {
    const partJobGrade = await this.partModel.findAll({
      where: {
        job_grade: levelId,
      },
    });
    if (partJobGrade.length > 0) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message:
            'This Job Grade Is Assigned To a Participant Therefor You Can Not Delete It',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.roleModel.destroy({
      where: { id: levelId },
    });
    return {
      status: 200,
      success: true,
      message: 'Job Grade Deleted Successfully',
    };
  }

  async getAllLevels(clientId: string, page: number, limit: number) {
    const offset = page * limit;
    const levels = await this.roleModel.findAll({
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
      where: {
        client_id: clientId,
        ...getSearchObject(this.requestParams.query, ['role']),
      },
      include: [
        {
          model: NbolLeadLevels,
          as: 'nbol',
          required: true,
          attributes: ['id', 'leadership_level'],
          include: [
            {
              model: Competencies,
              as: 'competencies',
            },
          ],
        },
      ],
    });
    // const count = await this.roleModel.count({
    //   where: {
    //     client_id: clientId,
    //   },
    // });
    return {
      rows: levels,
      count: await this.roleModel.count({
        where: {
          client_id: clientId,
        },
      }),
    };
  }
}
