import { Module } from '@nestjs/common';
import { CbiService } from './cbi.service';
import { CbiController } from './cbi.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { CoreQuestionResponse } from '../model/core_ques_resp.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { PropQuesResp } from '../model/prop_ques_resp.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { CbiReport } from '../model/cbi_report.model';
import { RequestParamsService } from 'src/Modules/requestParams';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ParticipantsAssessments,
      Questions,
      CoreQuestionResponse,
      PropQuesResp,
      Competencies,
      Participants,
      CbiReport,
    ]),
  ],
  controllers: [CbiController],
  providers: [CbiService, RequestParamsService],
})
export class CbiModule {}
