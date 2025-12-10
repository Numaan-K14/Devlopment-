import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Clients } from '../model/clients.model';
import { Contactperson } from '../../client-contact-persons/contactPerson.model';
import { Sequelize } from 'sequelize-typescript';
import { createClient } from '../dto/createClient.dto';
import {
  CreationAttributes,
  NumberDataType,
  QueryTypes,
  Op,
  FindAndCountOptions,
  Includeable,
  WhereOptions,
  where,
  literal,
  Transaction,
} from 'sequelize';
import { Projects } from 'src/Modules/client-project/project.model';
import { Tenant } from 'src/Modules/nbol_360_data/model/tenants.model';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { AssociateCompanies } from '../model/associateCompanies.model';
import { error } from 'node:console';
import { Exclude } from 'class-transformer';
import axios from 'axios';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Clients)
    private clientModel: typeof Clients,

    @InjectModel(Projects)
    private projectsModel: typeof Projects,

    @InjectModel(Contactperson)
    private contactPersonModel: typeof Contactperson,

    @InjectModel(Tenant, 'nbol360')
    private tenantModel: typeof Tenant,

    @InjectModel(Class)
    private classModel: typeof Class,

    @InjectModel(AssociateCompanies)
    private associateCompModel: typeof AssociateCompanies,

    private sequelize: Sequelize,
    private readonly requestParams: RequestParamsService,
  ) {}

  // async getNbol_360_Clients(): Promise<any> {
  //   const nbol_clients = await this.tenantModel.findAll({
  //     where: {
  //       is_channel_partner: false,
  //     },
  //   });
  //   if (!nbol_clients || nbol_clients.length === 0) {
  //     throw new HttpException(
  //       {
  //         status: 404,
  //         success: false,
  //         message: 'Clients Not Found',
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   return nbol_clients;
  // }

  async getNbol_360_Clients(): Promise<any> {
    const response = await axios.get<{ data: any }>(
      `${process.env.Insight360_URL}/api/v1/tenant/nbol-clients`,
      {
        params: {
          nbol_token: process.env.NBOL_Token,
        },
      },
    );
    return response.data.data;
  }

  async createClient(clientData: createClient): Promise<Clients> {
    // return await this.sequelize.transaction(async (transaction) => {

    let transaction: Transaction | null = await this.sequelize.transaction();
    const existingClient = await this.clientModel.findOne({
      where: { client_name: clientData.client_name.trim() },
      attributes: ['id', 'client_name'],
      transaction,
    });

    if (existingClient) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: `Client With the same name ${clientData.client_name} Already Exists`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const client = await this.clientModel.create(
      {
        client_name: clientData.client_name,
        is_360_client: clientData.is_360_client,
        nbol_client_name: clientData.nbol_client_name,
        nbol_client_schema: clientData.nbol_client_schema,
        nbol_client_id: clientData.nbol_client_id,
        is_grp_comp: clientData.is_grp_of_comp,
      } as Clients,
      { transaction },
    );

    //   const existingContsctPerson = await this.contactPersonModel.findOne({
    //   where: {
    //     email: {
    //       [Op.in]: clientData.contact_persons.map((person) => person.email.trim()),
    //     },
    //   },
    //   attributes: ['email'],
    // });

    // if (existingContsctPerson) {
    //   throw new HttpException(
    //     {
    //       status: 400,
    //       success: false,
    //       message: `Contact Person With Email ${existingContsctPerson.email} Already Exists`,
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    const contactPersons: CreationAttributes<Contactperson>[] =
      clientData.contact_persons.map(
        (person): CreationAttributes<Contactperson> =>
          ({
            name: person.name,
            email: person.email,
            mobile: person.mobile,
            department: person.department,
            client_id: client.id,
          }) as CreationAttributes<Contactperson>,
      );

    await this.contactPersonModel.bulkCreate(contactPersons, { transaction });
    const associateComps = Array.isArray(clientData.associate_comp)
      ? clientData.associate_comp.map((comp) => comp.assoc_comp)
      : [];

    associateComps.push(client.id);

    if (associateComps.length > 0) {
      const associateCompRecords: CreationAttributes<AssociateCompanies>[] = [];

      for (let i = 0; i < associateComps.length; i++) {
        for (let j = i + 1; j < associateComps.length; j++) {
          associateCompRecords.push({
            client_id: associateComps[i],
            assoc_comp: associateComps[j],
          } as CreationAttributes<AssociateCompanies>);
          associateCompRecords.push({
            client_id: associateComps[j],
            assoc_comp: associateComps[i],
          } as CreationAttributes<AssociateCompanies>);
        }
      }

      await this.associateCompModel.bulkCreate(associateCompRecords, {
        transaction,
      });
    }

    if (transaction) {
      await transaction.commit();
      transaction = null;
    }

    const associateCompaniesIds: any[] = [];

    if (clientData.is_grp_of_comp === true) {
      const associateCompanies = await this.associateCompModel.findAll({
        where: {
          client_id: client.id,
        },
        raw: true,
        nest: true,
      });

      associateCompanies.map((company) => {
        associateCompaniesIds.push(company.assoc_comp);
      });

      const updateClientstatus = await this.clientModel.findAll({
        where: {
          id: {
            [Op.in]: associateCompaniesIds,
          },
        },
        attributes: ['id', 'client_name'],
        raw: true,
        nest: true,
      });

      await Promise.all(
        updateClientstatus.map((client) =>
          this.clientModel.update(
            { is_grp_comp: true },
            { where: { id: client.id } },
          ),
        ),
      );
    }

    return client;
    // });
  }

  async logoUpload(logo_path: string | null, client_id: string) {
    const client = await this.clientModel.findByPk(client_id);
    if (!client) {
      throw new HttpException(
        {
          message: 'Client not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    client.update({
      logo: logo_path,
    } as any);
    return client;
  }

  async getAllClients(page: number = 0, limit: number = 10): Promise<any> {
    const offset = page * limit;
    const clients = await this.clientModel.findAll({
      where: {
        ...getSearchObject(this.requestParams.query, [
          'client_name',
          // 'name',
        ]),
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Contactperson,
          as: 'contact_persons',
          attributes: ['id', 'name'],
          required: true,
          limit: 1,
          order: [['id', 'Asc']],
        },
      ],
    });
    if (!clients || clients.length === 0) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'Clients Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      rows: clients,
      count: await this.clientModel.count(),
    };
  }

  async getAllClientsnoLimit(): Promise<any> {
    const clients = await this.clientModel.findAll({
      where: {
        ...getSearchObject(this.requestParams.query, ['client_name']),
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: this.contactPersonModel,
          as: 'contact_persons',
          attributes: ['department'],
          limit: 1,
          order: [['id', 'Asc']],
        },
      ],
    });
    const record = await this.clientModel.count();
    if (!clients || clients.length === 0) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'Clients Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      rows: clients,
      records: record,
    };
  }

  async getClient(clientId: string): Promise<any> {
    const client = await this.clientModel.findByPk(clientId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: this.contactPersonModel,
          as: 'contact_persons',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          // limit: 1,
          order: [['id', 'Asc']],
        },
        {
          model: this.associateCompModel,
          as: 'assoc_companies',
          attributes: ['id', 'assoc_comp'],
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: Clients,
              as: 'assoc_client',
              attributes: ['id', 'client_name'],
            },
          ],
        },
      ],
    });
    if (!client) {
      throw new HttpException(
        {
          message: 'Client Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      rows: client,
    };
  }

  async deleteClient(clientId: string): Promise<any> {
    const clientClass = await this.classModel.findAll({
      where: {
        client_id: clientId,
      },
    });

    if (clientClass.length > 0) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message:
            '"Deletion Failed: There Is An Active CLASS Linked For This Client And Cannot Be Deleted"',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const client = await this.clientModel.findByPk(clientId);
    if (client) {
      await client.destroy();
      return {
        message: 'Client Deleted Successfully',
      };
    } else {
      throw new HttpException('Client Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async allClients(): Promise<any> {
    const client = await this.clientModel.findAll({
      where: {
        ...getSearchObject(this.requestParams.query, ['client_name']),
      },
    });
    return {
      rows: client,
    };
  }

  async updateClient(
    client_id: string,
    updateData: Partial<createClient>,
  ): Promise<Clients> {
    let transaction: null | Transaction = await this.sequelize.transaction();
    const client = await this.clientModel.findByPk(client_id, {
      transaction,
    });

    if (!client) {
      throw new HttpException('Client Not Found', HttpStatus.NOT_FOUND);
    }

    if (updateData.client_name) {
      client.client_name = updateData.client_name;
      await client.save({ transaction });
    }

    if (updateData.contact_persons && updateData.contact_persons.length > 0) {
      await this.contactPersonModel.destroy({
        where: { client_id },
        transaction,
      });

      const newContacts: CreationAttributes<Contactperson>[] =
        updateData.contact_persons.map(
          (person): CreationAttributes<Contactperson> =>
            ({
              name: person.name,
              email: person.email,
              mobile: person.mobile,
              department: person.department,
              client_id,
            }) as CreationAttributes<Contactperson>,
        );

      await this.contactPersonModel.bulkCreate(newContacts, { transaction });
    }

    const associateCompaniesIds: any[] = [];

    if (updateData.is_grp_of_comp === false) {
      await this.associateCompModel.destroy({
        where: {
          client_id: client_id,
        },
        transaction,
      });
      await this.associateCompModel.destroy({
        where: {
          assoc_comp: client_id,
        },
        transaction,
      });

      const associateCompanies = await this.associateCompModel.findAll({
        where: {
          client_id: client.id,
        },
        raw: true,
        nest: true,
      });

      associateCompanies.map((company) => {
        associateCompaniesIds.push(company.assoc_comp);
      });

      const updateClientstatus = await this.clientModel.findAll({
        where: {
          id: {
            [Op.in]: associateCompaniesIds,
          },
        },
        attributes: ['id', 'client_name'],
        raw: true,
        nest: true,
      });

      await Promise.all(
        updateClientstatus.map(
          (client) =>
            this.clientModel.update(
              { is_grp_comp: false },
              { where: { id: client.id } },
            ),
          { transaction },
        ),
      );

      await this.clientModel.update(
        { is_grp_comp: false },
        { where: { id: client_id }, transaction },
      );
    }

    if (updateData.associate_comp && updateData.associate_comp.length > 0) {
      await this.associateCompModel.destroy({
        where: {
          client_id: client_id,
        },
        transaction,
      });
      await this.associateCompModel.destroy({
        where: {
          assoc_comp: client_id,
        },
        transaction,
      });
      const associateComps = Array.isArray(updateData.associate_comp)
        ? updateData.associate_comp.map((comp) => comp.assoc_comp)
        : [];

      associateComps.push(client.id);

      const associateCompRecords: CreationAttributes<AssociateCompanies>[] = [];

      // associateComps.forEach((assoc_comp) => {
      //   associateCompRecords.push({
      //     client_id: client.id,
      //     assoc_comp: assoc_comp,
      //   } as CreationAttributes<AssociateCompanies>);
      //   associateCompRecords.push({
      //     client_id: assoc_comp,
      //     assoc_comp: client.id,
      //   } as CreationAttributes<AssociateCompanies>);
      // });

      for (let i = 0; i < associateComps.length; i++) {
        for (let j = i + 1; j < associateComps.length; j++) {
          if (i !== j) {
            associateCompRecords.push({
              client_id: associateComps[i],
              assoc_comp: associateComps[j],
            } as CreationAttributes<AssociateCompanies>);
            associateCompRecords.push({
              client_id: associateComps[j],
              assoc_comp: associateComps[i],
            } as CreationAttributes<AssociateCompanies>);
          }
        }
      }

      await this.associateCompModel.bulkCreate(associateCompRecords, {
        transaction,
      });

      await transaction.commit();
      transaction = null;

      const associateCompaniesIds: any[] = [];

      await this.clientModel.update(
        { is_grp_comp: true },
        { where: { id: client_id }, transaction },
      );
      const associateCompanies = await this.associateCompModel.findAll({
        where: {
          client_id: client_id,
        },
        raw: true,
        nest: true,
      });

      associateCompanies.map((company) => {
        associateCompaniesIds.push(company.assoc_comp);
      });

      const updateClientstatus = await this.clientModel.findAll({
        where: {
          id: {
            [Op.in]: associateCompaniesIds,
          },
        },
        attributes: ['id', 'client_name'],
        raw: true,
        nest: true,
      });

      await Promise.all(
        updateClientstatus.map(
          (client) =>
            this.clientModel.update(
              { is_grp_comp: true },
              { where: { id: client.id } },
            ),
          { transaction },
        ),
      );
    }

    await transaction?.commit();
    transaction = null;

    return client;
  }

  async getProjectsofClient(clientId: string) {
    const project = await this.clientModel.findAll({
      where: {
        id: clientId,
      },
    });
    if (project.length <= 0) {
      throw new HttpException(
        {
          message: 'Projects Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      rows: project,
    };
  }

  async search(): Promise<any> {
    const client = await this.clientModel.findAll({
      where: {
        ...getSearchObject(this.requestParams.query, ['client_name']),
      },
    });
    return {
      rows: client,
    };
  }

  async getAssociateCompanies(clientId: string): Promise<any> {
    const associateCompanies = await this.associateCompModel.findAll({
      where: {
        client_id: clientId,
      },
      attributes: ['id', 'assoc_comp', 'client_id'],
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Clients,
          as: 'assoc_client',
          attributes: ['id', 'client_name'],
          required: true,
        },
      ],
      raw: true,
      nest: true,
    });

    const associateCompaniesIds: any[] = [];

    associateCompanies.map((company) => {
      associateCompaniesIds.push(company.assoc_comp);
    });

    const updateClientstatus = await this.clientModel.findAll({
      where: {
        id: {
          [Op.in]: associateCompaniesIds,
        },
      },
      attributes: ['id', 'client_name'],
      raw: true,
      nest: true,
    });

    await Promise.all(
      updateClientstatus.map((client) =>
        this.clientModel.update(
          { is_grp_comp: true },
          { where: { id: client.id } },
        ),
      ),
    );

    // await this.clientModel.bulkCreate(
    //   updateClientstatus.map((client) => ({
    //     id: client.id,
    //     is_grp_comp: true,
    //     client_name: client.client_name,
    //   } as CreationAttributes<Clients>),
    //   {
    //     updateOnDuplicate: ['is_grp_comp', 'client_name'],
    //   },
    // ));

    if (!associateCompanies || associateCompanies.length === 0) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'Associate Companies Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return associateCompanies;
  }
}
