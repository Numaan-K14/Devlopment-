import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
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
  Unique,
} from 'sequelize-typescript';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Assessments } from './assessment.model';
import { Scenerios } from './scenerio.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { Questions } from './questions.model';
import { Quessionnaires } from './quessionnaire.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { truncate } from 'node:fs/promises';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { GroupActivityRooms } from 'src/Modules/class-configration/model/groupActivityRooms.model';

@Table({
  tableName: 'client_assessments',
})
export class ClientAssessments extends Model<ClientAssessments> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Unique
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
    allowNull: false,
  })
  cohort_id: string;

  @ForeignKey(() => Assessments)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessment_id: string;

  @ForeignKey(() => Scenerios)
  @Column({
    type: DataType.STRING,
  })
  scenerio_id: string;

  @ForeignKey(() => Quessionnaires)
  @Column({
    type: DataType.STRING,
  })
  quesionnaire_id: string;

   @Column({
    type: DataType.TEXT,
  })
  assessm_summary: string;

  @BelongsTo(() => Assessments, { as: 'assessment' })
  assessment: Assessments;

  @BelongsTo(() => Scenerios, {
    as: 'scenerio',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scenerio: Scenerios;

  @BelongsTo(() => Clients, { as: 'client' })
  client: Clients;

  @BelongsTo(() => Cohorts, { as: 'cohort' })
  cohort: Cohorts;

  @BelongsTo(() => Quessionnaires, {
    as: 'question',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  question: Quessionnaires;

  @BelongsTo(() => ParticipantsAssessments, {
    as: 'par_As',
    foreignKey: 'assessment_id',
  })
  participant_assessment: ParticipantsAssessments;

  @BelongsTo(() => GroupActivityRooms, {
    as: 'group_activity',
    foreignKey: 'assessment_id',
  })
  group_activity: GroupActivityRooms;
}
