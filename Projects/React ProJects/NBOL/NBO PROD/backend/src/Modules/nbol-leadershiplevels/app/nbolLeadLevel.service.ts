import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { error } from 'console';
import { NbolLeadLevels } from '../model/leadLevel.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { createNbolLevels } from '../dto/nbolDto';
import { RequestParamsService } from 'src/Modules/requestParams';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { ClientRoles } from 'src/Modules/client-roles-levels/model/role.model';

@Injectable()
export class NbolService {
  constructor(
    @InjectModel(NbolLeadLevels)
    private nbolModle: typeof NbolLeadLevels,

    @InjectModel(Competencies)
    private competencyModel: typeof Competencies,

    @InjectModel(ClientRoles)
    private clientRoleModel: typeof ClientRoles,

    private readonly requestParams: RequestParamsService,
  ) {}

  async createNbol(createNbol: createNbolLevels): Promise<any> {
    const ExistingLeadLevel = await this.nbolModle.findOne({
      where:{
        leadership_level: createNbol.leadership_level.trim()
      }
    })
    if (ExistingLeadLevel) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message:
            'Use Different Name, This Name Already Exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const nbollevel = await this.nbolModle.create({
      leadership_level: createNbol.leadership_level,
      // nbol_level_name: createNbol.nbol_level_name,
      description: createNbol.description,
    } as NbolLeadLevels);

    return nbollevel;
  }

  async singleLevel(nbolId: string): Promise<any> {
    const level = await this.nbolModle.findByPk(nbolId);
    if (!level) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Leadership Level Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return level;
  }

  async updateLeadLevel(
    nbolId: string,
    updateNbolLevel: Partial<createNbolLevels>,
  ): Promise<any> {
    const nbolLevel = await this.nbolModle.findByPk(nbolId);
    if (nbolLevel?.leadership_level != updateNbolLevel.leadership_level) {
      const ExistingLeadLevel = await this.nbolModle.findOne({
      where:{
        leadership_level: updateNbolLevel.leadership_level?.trim()
      }
    })
    if (ExistingLeadLevel) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message:
            'Use Different Name, This Name Already Exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    }
    if (!nbolLevel) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Leadership Level Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await nbolLevel.update(updateNbolLevel);
    return nbolLevel;
  }

  async deleteLevel(nbolId: string): Promise<any> {
    const clientUsedLeadLevel = await this.clientRoleModel.findAll({
      where: {
        nbol_id: nbolId,
      },
    });
    if (clientUsedLeadLevel.length > 0) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message:
            'You Can Not Delete a Leadership Level Which Is Used By Clients ',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.nbolModle.destroy({
      where: {
        id: nbolId,
      },
    });
    return{
      message: "Leadership Level Deleted Successfully"
    }
  }

  async allLeadLevels(page: number, limit: number): Promise<any> {
    const offset = page * limit;
    const leadLevels = await this.nbolModle.findAll({
      where: {
        ...getSearchObject(this.requestParams.query, ['leadership_level']),
      },
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
    });
    return {
      rows: leadLevels,
      count: await this.nbolModle.count({
        where: {
          ...getSearchObject(this.requestParams.query, ['leadership_level']),
        },
      }),
    };
  }
}
