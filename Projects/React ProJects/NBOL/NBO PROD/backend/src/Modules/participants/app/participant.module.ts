import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Participants } from '../model/participants.model';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ClientRoles } from 'src/Modules/client-roles-levels/model/role.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { RequestParamsService } from 'src/Modules/requestParams';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { AssociateCompanies } from 'src/Modules/clients/model/associateCompanies.model';

@Module({
  imports: [SequelizeModule.forFeature([Participants, ClientRoles, Cohorts, NbolLeadLevels,ParticipantsAssessments, Class, AssociateCompanies])],
  controllers: [ParticipantController],
  providers: [ParticipantService, RequestParamsService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
