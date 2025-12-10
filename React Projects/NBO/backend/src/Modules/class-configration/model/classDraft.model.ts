import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Index,
  IsDate,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { ClassAssessments } from './classAsessments.model';
import { ClassCompetencies } from './classAssessmentsCompetencies';
import { ParticipantsAssessments } from './participantAssessments.model';
import { Facilities } from 'src/Modules/facilities/model/facility.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { AssessmentResponse } from './participantsAssessmentsResponse.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { QuessionnaireResponse } from './participantQuessionaireResponse.model';
import { ClassPartReport } from 'src/Modules/report/model/class_part_report.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { GroupActivityRooms } from './groupActivityRooms.model';
import { Json } from 'sequelize/types/utils';
import { Projects } from 'src/Modules/client-project/project.model';

export enum progressStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}
@Table({
  tableName: 'class_draft',
})
export class ClassDraft extends Model<ClassDraft> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  client_id: string;
  @BelongsTo(() => Clients)
  client: Clients;

  @ForeignKey(() => Projects)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  project_id: string;
  @BelongsTo(() => Projects)
  project: Projects;

  @ForeignKey(() => Cohorts)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  cohort_id: string;
  @BelongsTo(() => Cohorts)
  cohort: Cohorts;

  @ForeignKey(() => Facilities)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  facility_id: string;
  @BelongsTo(() => Facilities)
  facility: Facilities;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  end_date: Date;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  class_data: any;

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
  })
  status: progressStatus;
}
