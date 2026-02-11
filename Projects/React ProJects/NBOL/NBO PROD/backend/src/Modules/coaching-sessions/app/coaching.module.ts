import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Coaching } from '../model/coaching.model';
import { CoachingController } from './coaching.controller';
import { CoachingService } from './coaching.service';
import { RequestParamsService } from 'src/Modules/requestParams';
import { EmailModule } from 'src/Modules/mail/email.module';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { ClassConfigrationModule } from 'src/Modules/class-configration/app/class.module';
import { ClassService } from 'src/Modules/class-configration/app/class.service';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { ClassAssessors } from 'src/Modules/class-configration/model/classPartAssessmAssessors.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { ClassPartReport } from 'src/Modules/report/model/class_part_report.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Coaching,
      Clients,
      Projects,
      Cohorts,
      Participants,
      Assessros,
      Class,
      ClassAssessors,
      ParticipantsAssessments,
      ClassPartReport
    ]),
    EmailModule,
    ClassConfigrationModule
  ],
  controllers: [CoachingController],
  providers: [CoachingController, RequestParamsService, CoachingService,],
  exports: [CoachingService],
})
export class CoachingModule {}
