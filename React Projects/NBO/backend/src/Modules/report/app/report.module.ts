import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { ClientAssessments } from 'src/Modules/assessment/model/client-assessments.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { ClassAssessments } from 'src/Modules/class-configration/model/classAsessments.model';
import { ClassCompetencies } from 'src/Modules/class-configration/model/classAssessmentsCompetencies';
import { ClassAssessors } from 'src/Modules/class-configration/model/classPartAssessmAssessors.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';
import { AssessmentResponse } from 'src/Modules/class-configration/model/participantsAssessmentsResponse.model';
import { ParticipantScore } from 'src/Modules/class-configration/model/participantScore.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { ExpectedBehaviours } from 'src/Modules/competencies/model/expected_behaviour.model';
import { Facilities } from 'src/Modules/facilities/model/facility.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Users } from 'src/Modules/users/model/user.model';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { ParticipantAvgComp } from '../model/part_average_comp_score.model';
import { ClassPartReport } from '../model/class_part_report.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { EmailModule } from 'src/Modules/mail/email.module';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { NbolClientCompetency } from 'src/Modules/competencies/model/nbol_client_competency.model';
import { AssessorsMeetScore } from 'src/Modules/class-configration/model/assessorsMeetScore.model';
import { RequestParamsService } from 'src/Modules/requestParams';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Class,
      ClassPartReport,
      ClassCompetencies,
      ParticipantsAssessments,
      ClassAssessors,
      ClassAssessments,
      Competencies,
      ExpectedBehaviours,
      Scenerios,
      ClientAssessments,
      Assessments,
      Participants,
      Users,
      Assessros,
      Facilities,
      Clients,
      AssessmentResponse,
      ParticipantScore,
      Questions,
      QuessionnaireResponse,
      ParticipantAvgComp,
      Cohorts,
      Quessionnaires,
      NbolClientCompetency,
      AssessorsMeetScore
    ]),
    EmailModule
  ],
  controllers: [ReportController],
  providers: [ReportService,RequestParamsService],
  exports: [ReportService],
})
export class ReportModule {}
