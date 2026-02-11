import { Module } from '@nestjs/common';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Assessments } from '../model/assessment.model';
import { Scenerios } from '../model/scenerio.model';
import { ClientAssessments } from '../model/client-assessments.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Questions } from '../model/questions.model';
import { Quessionnaires } from '../model/quessionnaire.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { ParticipantScore } from 'src/Modules/class-configration/model/participantScore.model';
import { AssessmentResponse } from 'src/Modules/class-configration/model/participantsAssessmentsResponse.model';
import { RequestParamsService } from 'src/Modules/requestParams';
import { AssessorsMeetScore } from 'src/Modules/class-configration/model/assessorsMeetScore.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Assessments,
      Scenerios,
      ClientAssessments,
      Clients,
      Questions,
      Quessionnaires,
      Projects,
      Cohorts,
      NbolLeadLevels,
      Competencies,
      ParticipantScore,
      AssessmentResponse,
      AssessorsMeetScore,
      ParticipantsAssessments,
      QuessionnaireResponse

    ]),
  ],
  providers: [AssessmentService, RequestParamsService],
  controllers: [AssessmentController],
  exports: [AssessmentService],
})
export class AssessmentModule {}
