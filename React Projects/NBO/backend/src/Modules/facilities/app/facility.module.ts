import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rooms } from '../model/rooms.model';
import { FacilityService } from './facility.service';
import { FacilityController } from './facility.controller';
import { Facilities } from '../model/facility.model';
import { RequestParamsService } from 'src/Modules/requestParams';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';

@Module({
  imports: [SequelizeModule.forFeature([Facilities, Rooms, Class, ParticipantsAssessments])],
  providers: [FacilityService, RequestParamsService],
  controllers: [FacilityController],
  exports: [FacilityService],
})
export class FacilityModule {}
