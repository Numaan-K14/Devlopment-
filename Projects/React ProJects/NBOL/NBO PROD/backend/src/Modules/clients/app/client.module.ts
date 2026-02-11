import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { Tenant } from 'src/Modules/nbol_360_data/model/tenants.model';
import { ClientService } from './client.service';
import sequelize, { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Clients } from '../model/clients.model';
import { Contactperson } from '../../client-contact-persons/contactPerson.model';
import { ClientAssessments } from '../../assessment/model/client-assessments.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { Nbol_360_Module } from 'src/Modules/nbol_360_data/app/nbol_360.module';
import { RequestParamsService } from 'src/Modules/requestParams';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { AssociateCompanies } from '../model/associateCompanies.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Clients,
      Contactperson,
      ClientAssessments,
      Projects,
      Class,
      AssociateCompanies
    ]),
    Nbol_360_Module,
  ],
  controllers: [ClientController],
  providers: [ClientService, RequestParamsService],
  exports: [ClientService],
})
export class ClientModule {}
