import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Assessros } from '../model/assessor.model';
import { AssessorController } from './assessor.controller';
import { AssessorsService } from './assessor.service';
import { RequestParamsService } from 'src/Modules/requestParams';
import { EmailModule } from 'src/Modules/mail/email.module';

@Module({
  imports: [SequelizeModule.forFeature([Assessros]), EmailModule],
  controllers: [AssessorController],
  providers: [AssessorsService, RequestParamsService],
  exports: [AssessorsService],
})
export class AssessorModule {}
