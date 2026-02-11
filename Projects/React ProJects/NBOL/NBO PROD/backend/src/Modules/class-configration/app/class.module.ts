import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Class } from '../model/class.model';
import { ClassCompetencies } from '../model/classAssessmentsCompetencies';
import { ParticipantsAssessments } from '../model/participantAssessments.model';
import { ClassAssessors } from '../model/classPartAssessmAssessors.model';
import { ClassAssessments } from '../model/classAsessments.model';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { ExpectedBehaviours } from 'src/Modules/competencies/model/expected_behaviour.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { ClientAssessments } from 'src/Modules/assessment/model/client-assessments.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Users } from 'src/Modules/users/model/user.model';
import { EmailService } from 'src/Modules/mail/email.service';
import { EmailModule } from 'src/Modules/mail/email.module';
import { Facilities } from 'src/Modules/facilities/model/facility.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { AssessmentResponse } from '../model/participantsAssessmentsResponse.model';
import { ParticipantScore } from '../model/participantScore.model';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { QuessionnaireResponse } from '../model/participantQuessionaireResponse.model';
import * as path from 'path';
import { ReportModule } from 'src/Modules/report/app/report.module';
import { ClassPartReport } from 'src/Modules/report/model/class_part_report.model';
import { GroupActivityPart } from '../model/groupActivityParticipants.model';
import { GroupActivityRooms } from '../model/groupActivityRooms.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { ClassDraft } from '../model/classDraft.model';
import { AssessorsMeetScore } from '../model/assessorsMeetScore.model';
import { AutoSchedulingService } from '../scheduling/auto-scheduling.service';
// import { SchedulerV2Service } from '../scheduling/scheduler-v2.service';
// import { AvailabilityMatrixBuilder } from '../scheduling/availability-builder'; // Removed to avoid circular dependency
import { Rooms } from 'src/Modules/facilities/model/rooms.model';
import { ScheduleDraft } from '../model/scheduleDraft.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { CompetencyModule } from 'src/Modules/competencies/app/competency.module';
import { AdminScore } from '../model/adminFinalScore.model';
import { RequestParamsService } from 'src/Modules/requestParams';
import { PreClassSchedule } from '../model/preClassSchedule.model';
import { ScheduleModule } from '@nestjs/schedule';
import { ClassBreaks } from '../model/classBreaks.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Class,
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
      GroupActivityPart,
      GroupActivityRooms,
      Quessionnaires,
      ClassDraft,
      AssessorsMeetScore,
      Rooms,
      Participants,
      Assessros,
      ScheduleDraft,
      Rooms,
      Clients,
      Projects,
      Cohorts,
      AdminScore,
      PreClassSchedule,
      // ClassBreaks,
    ]),
    EmailModule,
    ReportModule,
    CompetencyModule
  ],
  controllers: [ClassController],
  providers: [ClassService, AutoSchedulingService, RequestParamsService],
  exports: [ClassService, AutoSchedulingService],
})
export class ClassConfigrationModule {}
