import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from './database/database.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientModule } from './Modules/clients/app/client.module';
import { FacilityModule } from './Modules/facilities/app/facility.module';
import { ParticipantModule } from './Modules/participants/app/participant.module';
import { NbolModule } from './Modules/nbol-leadershiplevels/app/nbolLeadLevel.module';
import { RoleModule } from './Modules/client-roles-levels/app/role.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors';
import { CompetencyModule } from './Modules/competencies/app/competency.module';
import { AssessorModule } from './Modules/assessors/app/assessor.module';
import { AssessmentModule } from './Modules/assessment/app/assessement.module';
import { UserModule } from './Modules/users/app/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClassConfigrationModule } from './Modules/class-configration/app/class.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Assessments } from './Modules/assessment/model/assessment.model';
import { ClientAssessments } from './Modules/assessment/model/client-assessments.model';
import { Scenerios } from './Modules/assessment/model/scenerio.model';
import { Assessros } from './Modules/assessors/model/assessor.model';
import { Class } from './Modules/class-configration/model/class.model';
import { ClassAssessments } from './Modules/class-configration/model/classAsessments.model';
import { ClassCompetencies } from './Modules/class-configration/model/classAssessmentsCompetencies';
import { ClassAssessors } from './Modules/class-configration/model/classPartAssessmAssessors.model';
import { ParticipantsAssessments } from './Modules/class-configration/model/participantAssessments.model';
import { Contactperson } from './Modules/client-contact-persons/contactPerson.model';
import { ClientRoles } from './Modules/client-roles-levels/model/role.model';
import { Clients } from './Modules/clients/model/clients.model';
import { Competencies } from './Modules/competencies/model/competency.model';
import { ExpectedBehaviours } from './Modules/competencies/model/expected_behaviour.model';
import { NbolClientCompetency } from './Modules/competencies/model/nbol_client_competency.model';
import { Facilities } from './Modules/facilities/model/facility.model';
import { Rooms } from './Modules/facilities/model/rooms.model';
import { NbolLeadLevels } from './Modules/nbol-leadershiplevels/model/leadLevel.model';
import { Participants } from './Modules/participants/model/participants.model';
import { Users } from './Modules/users/model/user.model';
import { EmailModule } from './Modules/mail/email.module';
import { AssessmentResponse } from './Modules/class-configration/model/participantsAssessmentsResponse.model';
import { ParticipantScore } from './Modules/class-configration/model/participantScore.model';
import { Questions } from './Modules/assessment/model/questions.model';
import { Quessionnaires } from './Modules/assessment/model/quessionnaire.model';
import { QuessionnaireResponse } from './Modules/class-configration/model/participantQuessionaireResponse.model';
import { ReportModule } from './Modules/report/app/report.module';
import { ParticipantAvgComp } from './Modules/report/model/part_average_comp_score.model';
import { ClassPartReport } from './Modules/report/model/class_part_report.model';
import { Projects } from './Modules/client-project/project.model';
import { Cohorts } from './Modules/project-cohort/model/cohort.model';
import { ProjectModule } from './Modules/client-project/app/project.module';
import { CohortModule } from './Modules/project-cohort/app/cohort.module';
import { Nbol_360_Module } from './Modules/nbol_360_data/app/nbol_360.module';
import { Tenant } from './Modules/nbol_360_data/model/tenants.model';
import { GroupActivityRooms } from './Modules/class-configration/model/groupActivityRooms.model';
import { GroupActivityPart } from './Modules/class-configration/model/groupActivityParticipants.model';
import { ClassDraft } from './Modules/class-configration/model/classDraft.model';
import { CoachingModule } from './Modules/coaching-sessions/app/coaching.module';
import { Coaching } from './Modules/coaching-sessions/model/coaching.model';
import { AssociateCompanies } from './Modules/clients/model/associateCompanies.model';
import { AssessorsMeetScore } from './Modules/class-configration/model/assessorsMeetScore.model';
import { CompetencyWeightage } from './Modules/competencies/model/competency_weightage.model';
import { ScheduleDraft } from './Modules/class-configration/model/scheduleDraft.model';
import { AdminScore } from './Modules/class-configration/model/adminFinalScore.model';
import { PropQuesResp } from './Modules/ai_ques_resp/model/prop_ques_resp.model';
import { CoreQuestionResponse } from './Modules/ai_ques_resp/model/core_ques_resp.model';
import { CbiModule } from './Modules/ai_ques_resp/app/cbi.module';

import { PreClassSchedule } from './Modules/class-configration/model/preClassSchedule.model';
import { ScheduleModule } from '@nestjs/schedule';
import { ClassService } from './Modules/class-configration/app/class.service';
import { CronjobModule } from './cron-job/cron_jon.module';
import { ClassBreaks } from './Modules/class-configration/model/classBreaks.model';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { CbiReport } from './Modules/ai_ques_resp/model/cbi_report.model';
@Module({
  imports: [
    // ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          dialect: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          models: [
            Clients,
            Contactperson,
            Projects,
            Cohorts,
            Facilities,
            Rooms,
            Class,
            ClassPartReport,
            Participants,
            NbolLeadLevels,
            ClientRoles,
            Competencies,
            ExpectedBehaviours,
            Assessros,
            Assessments,
            Scenerios,
            ClientAssessments,
            Users,
            NbolClientCompetency,
            ClassCompetencies,
            ParticipantsAssessments,
            ClassAssessors,
            ClassAssessments,
            AssessmentResponse,
            ParticipantScore,
            Questions,
            Quessionnaires,
            QuessionnaireResponse,
            ParticipantAvgComp,
            GroupActivityRooms,
            GroupActivityPart,
            ClassDraft,
            Coaching,
            AssociateCompanies,
            AssessorsMeetScore,
            CompetencyWeightage,
            ScheduleDraft,
            AdminScore,
            PreClassSchedule,
            ClassBreaks,
            PropQuesResp,
            CoreQuestionResponse,
            CbiReport,
          ],
          // synchronize: true,
          // autoLoadModels: true,
          // alter: true,

          // logging:false,
        };
      },
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([Users]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWTKEY') || process.env.JWTKEY,
        signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
      }),
      inject: [ConfigService],
    }),
    ClientModule,
    FacilityModule,
    ParticipantModule,
    NbolModule,
    RoleModule,
    CompetencyModule,
    AssessorModule,
    AssessmentModule,
    UserModule,
    ClassConfigrationModule,
    EmailModule,
    ReportModule,
    ProjectModule,
    CohortModule,
    CoachingModule,
    CronjobModule,
    CbiModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/public',
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    AuthMiddleware,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.POST },
        { path: '/user/update-password', method: RequestMethod.PUT },
        { path: '/user/generate-otp', method: RequestMethod.PUT },
        { path: '/user/verify-otp', method: RequestMethod.POST },
        // { path: '/class/get-participant-comp-exp', method: RequestMethod.GET },
        // { path: '/class/assessment-response-ai-summary', method: RequestMethod.PUT},
        // { path: '/report/update-report-ai-data', method: RequestMethod.PUT },
        // { path: '/report/ai-details', method: RequestMethod.GET },
        '/public/(.*)',
        '/class/get-participant-comp-exp/(.*)',
        '/class/assessment-response-ai-summary/(.*)',
        '/report/update-report-ai-data/(.*)',
        '/report/ai-details/(.*)',
        '/report-ui/(.*)',
        '/report/report-download/(.*)',
      )
      .forRoutes('*');
  }
}
