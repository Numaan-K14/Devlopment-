import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Competencies } from '../model/competency.model';
import { ExpectedBehaviours } from '../model/expected_behaviour.model';
import { CompetencyController } from './competency.controller';
import { NbolLeadLevels } from '../../nbol-leadershiplevels/model/leadLevel.model';
import { NbolClientCompetency } from '../model/nbol_client_competency.model';
import { CompetencyService } from './competency.service';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { ClientRoles } from 'src/Modules/client-roles-levels/model/role.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { RequestParamsService } from 'src/Modules/requestParams';
import { CompetencyWeightage } from '../model/competency_weightage.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { ClientAssessments } from 'src/Modules/assessment/model/client-assessments.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { Participants } from 'src/Modules/participants/model/participants.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ClientRoles,
      Competencies,
      NbolLeadLevels,
      ExpectedBehaviours,
      NbolClientCompetency,
      Clients,
      Projects,
      CompetencyWeightage,
      Assessments,
      Scenerios,
      Quessionnaires,
      ClientAssessments,
      Class,
      Participants,
    ]),
  ],
  providers: [CompetencyService, RequestParamsService],
  controllers: [CompetencyController],
  exports: [CompetencyService],
})
export class CompetencyModule {}
