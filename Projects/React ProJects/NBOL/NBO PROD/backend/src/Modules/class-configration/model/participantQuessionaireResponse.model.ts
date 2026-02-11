import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  BelongsTo,
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
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Class } from './class.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { ParticipantsAssessments } from './participantAssessments.model';
import { ParticipantScore } from './participantScore.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { AssessmentResponse } from './participantsAssessmentsResponse.model';
import { AssessorsMeetScore } from './assessorsMeetScore.model';

export enum progressStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}
@Table({
  tableName: 'quessionaire_response',
})
export class QuessionnaireResponse extends Model<QuessionnaireResponse> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: string;

  @IsString()
  @Column({
    type: DataType.TEXT,
  })
  response: string;

  @IsNotEmpty()
  @ForeignKey(() => Questions)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  question_id: string;

  @BelongsTo(() => Questions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  questions: Questions;

  @IsNotEmpty()
  @ForeignKey(() => Competencies)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  competency_id: string;

  @BelongsTo(() => Competencies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  competency: Competencies;

  @IsNotEmpty()
  @ForeignKey(() => Quessionnaires)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  quessionaire_id: string;

  @BelongsTo(() => Quessionnaires, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quessionaire: Quessionnaires;

  @IsNotEmpty()
  @ForeignKey(() => AssessmentResponse)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessm_resp_id: string;

  @BelongsTo(() => AssessmentResponse, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assm_resp: AssessmentResponse;

  // @Default(progressStatus.PENDING)
  // @Column({
  //   type: DataType.ENUM(...Object.values(progressStatus)),
  //   defaultValue: true,
  // })
  // status: progressStatus;

  @HasMany(()=> AssessorsMeetScore)
  assess_score: AssessorsMeetScore[]
}
