import { Module } from '@nestjs/common';
import { CohortService } from './cohort.service';
import { CohortController } from './cohort.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cohorts } from '../model/cohort.model';

@Module({
  imports: [SequelizeModule.forFeature([Cohorts])],
  providers: [CohortService],
  controllers: [CohortController],
  exports: [CohortService],
})
export class CohortModule {}
