import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Rooms } from 'src/Modules/facilities/model/rooms.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';

export enum progressStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}
@Table({
  tableName: 'pre_class_schedule',
})
export class PreClassSchedule extends Model<PreClassSchedule> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => Cohorts)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cohort_id: string;
  @BelongsTo(() => Cohorts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class: Cohorts;

  @ForeignKey(() => Assessments)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessment_id: string;
  @BelongsTo(() => Assessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assessment: Assessments;

  @ForeignKey(() => Participants)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  participant_id: string;
  @BelongsTo(() => Participants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  participant: Participants;

  @ForeignKey(() => Rooms)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  room_id: string;
  @BelongsTo(() => Rooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  room: Rooms;

  @ForeignKey(() => Scenerios)
  @Column({
    type: DataType.STRING,
  })
  scenerio_id: string;
  @BelongsTo(() => Scenerios, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scenerio: Scenerios;

  @ForeignKey(() => Quessionnaires)
  @Column({
    type: DataType.STRING,
  })
  quessionnaire_id: string;
  @BelongsTo(() => Quessionnaires, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quessionnaire: Quessionnaires;

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
    defaultValue: true,
  })
  assessor_status: progressStatus;

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
    defaultValue: true,
  })
  participant_status: progressStatus;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  assess_now: boolean;

  @Column({
    type: DataType.STRING,
  })
  start_time: string;

  @Column({
    type: DataType.STRING,
  })
  end_time: string;

  @Column({
    type: DataType.STRING,
    allowNull : true
  })
  ppt_path: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  class_date: Date;
}
