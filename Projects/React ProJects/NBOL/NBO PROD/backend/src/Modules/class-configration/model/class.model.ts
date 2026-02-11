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
import { ClassBreaks } from './classBreaks.model';

export enum progressStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}
@Table({
  tableName: 'class',
})
export class Class extends Model<Class> {
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

  @ForeignKey(() => Cohorts)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  cohort_id: string;

  @ForeignKey(() => Facilities)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  facility_id: string;

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
    type: DataType.INTEGER,
    // allowNull: false,
  })
  normal_assess_duration: number;

  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  grp_act_assess_duration: number;

  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  cbi_assess_duration: number;

  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  welcome_sess_duration: number;

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
    defaultValue: true,
  })
  status: progressStatus;

  @BelongsTo(() => Clients)
  client: Clients;

  @BelongsTo(() => Cohorts)
  cohort: Cohorts;

  @BelongsTo(() => Facilities)
  facility: Facilities;

  // @BelongsToMany(() => Assessments, () => ClassAssessments)
  // class_assessments: Assessments[];

  @HasMany(() => ParticipantsAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  participant_assessments: ParticipantsAssessments[];

  // @HasMany(() => ClassCompetencies, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // competency_configrations: ClassCompetencies[];

  @HasMany(() => ClassAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class_assessments: ClassAssessments[];

  @HasMany(() => ClassCompetencies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class_competencies: ClassCompetencies[];

  @HasMany(() => Scenerios, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scenerios: Scenerios[];

  @HasMany(() => AssessmentResponse)
  assessment_response: AssessmentResponse[];

  @HasMany(() => Quessionnaires, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  questions: Quessionnaires[];

  // @HasMany(() => QuessionnaireResponse, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // quessionnaire_response: QuessionnaireResponse[];

  @HasMany(() => ClassPartReport, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cl_par_report: ClassPartReport[];

  @HasMany(() => GroupActivityRooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  grp_act_rooms: GroupActivityRooms[];

  // @HasMany(() => forwardRef(() => CLassPartReport), {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // cl_par_report: CLassPartReport[];

  @HasMany(() => ClassBreaks)
  class_breaks: ClassBreaks[];
}
