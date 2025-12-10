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
  tableName: 'admin_final_score',
})
export class AdminScore extends Model<AdminScore> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
  })
  score: string;

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

}
