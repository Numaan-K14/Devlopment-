import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Assessments } from './assessment.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { ClientAssessments } from './client-assessments.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { Questions } from './questions.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';
import { ParticipantScore } from 'src/Modules/class-configration/model/participantScore.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { PreClassSchedule } from 'src/Modules/class-configration/model/preClassSchedule.model';

@Table({
  tableName: 'quesionnaires',
})
export class Quessionnaires extends Model<Quessionnaires> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  quesionnaire_name: string;

  @ForeignKey(() => Assessments)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessment_id: string;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  class_id?: string | null;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  client_id: string;

  @ForeignKey(() => Cohorts)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cohort_id?: string | null;

  @ForeignKey(() => Projects)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  project_id?: string | null;

  @BelongsTo(() => Projects)
  project: Projects;

  @BelongsTo(() => Cohorts)
  cohort: Cohorts;

  @BelongsTo(() => Assessments)
  assessment: Assessments;

  @BelongsTo(() => Class)
  class: Class;

  @HasMany(() => ClientAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client_assessment: ClientAssessments[];

  @HasMany(() => Questions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  questions: Questions[];

  @HasMany(() => QuessionnaireResponse, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quessionnaire_response: QuessionnaireResponse[];

  @HasMany(() => ParticipantScore, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  part_score: ParticipantScore[];

  @HasMany(() => ParticipantsAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  part_assessment: ParticipantsAssessments[];

  @HasMany(() => PreClassSchedule)
  pre_class: PreClassSchedule[];
}
