import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  IsUUID,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { AssessmentResponse } from './participantsAssessmentsResponse.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { IsNotEmpty } from 'class-validator';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { AssessorsMeetScore } from './assessorsMeetScore.model';

@Table({
  tableName: 'participant_score',
})
export class ParticipantScore extends Model<ParticipantScore> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: string;

  @Column({
    type: DataType.TEXT,
    // allowNull: false,
  })
  observation: string;

  @Column({
    type: DataType.TEXT,
    // allowNull: false,
  })
  summary: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  score: string;

  @Column({
    type: DataType.TEXT,
    // allowNull: false,
  })
  quess_response: string;

  @IsNotEmpty()
  @ForeignKey(() => Questions)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  question_id: string;

  @BelongsTo(() => Questions)
  questions: Questions;

  @IsNotEmpty()
  @ForeignKey(() => Quessionnaires)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  quessionaire_id: string;

  @BelongsTo(() => Quessionnaires)
  quessionaire: Quessionnaires;

  @IsNotEmpty()
  @ForeignKey(() => Competencies)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  competency_id: string;

  @BelongsTo(() => Competencies)
  competency: Competencies;

  @IsNotEmpty()
  @ForeignKey(() => AssessmentResponse)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessment_response: string;

  @BelongsTo(() => AssessmentResponse, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  response: AssessmentResponse;

  @HasMany(() => AssessorsMeetScore, {
    as:'sc_pa',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assessor_score: AssessorsMeetScore[];
}
