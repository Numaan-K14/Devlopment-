import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Projects } from '../project.model';
import { ProjectController } from './project.controller';
import { RequestParamsService } from 'src/Modules/requestParams';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { Class } from 'src/Modules/class-configration/model/class.model';

@Module({
  imports: [SequelizeModule.forFeature([Projects, NbolLeadLevels, Class])],
  providers: [ProjectService, RequestParamsService],
  exports: [ProjectService],
  controllers:[ProjectController]
})
export class ProjectModule {}
