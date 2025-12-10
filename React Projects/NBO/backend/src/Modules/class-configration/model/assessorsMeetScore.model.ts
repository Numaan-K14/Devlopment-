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
} from 'sequelize-typescript';
import { AssessmentResponse } from './participantsAssessmentsResponse.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { IsNotEmpty } from 'class-validator';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { ParticipantScore } from './participantScore.model';
import { QuessionnaireResponse } from './participantQuessionaireResponse.model';

@Table({
  tableName: 'assessors_meet_scores',
})
export class AssessorsMeetScore extends Model<AssessorsMeetScore> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: string;

  @Column({
    type: DataType.TEXT,
  })
  observation: string;

  @Column({
    type: DataType.STRING,
  })
  score: string;

  @ForeignKey(() => Assessros)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessor_id: string;

  @BelongsTo(() => Assessros, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assessor: Assessros;

  @ForeignKey(() => AssessmentResponse)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assem_resp_id: string;

  @BelongsTo(() => AssessmentResponse, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  response: AssessmentResponse;

  @ForeignKey(() => ParticipantScore)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  part_score_id: string;

  @BelongsTo(() => ParticipantScore, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  part_score: ParticipantScore;

  @ForeignKey(() => QuessionnaireResponse)
  @Column({
    type: DataType.STRING,
  })
  quess_resp: string;

  @BelongsTo(() => QuessionnaireResponse, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quess_res: QuessionnaireResponse;
}
