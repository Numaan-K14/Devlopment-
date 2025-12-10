import { IsNotEmpty } from 'class-validator';
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { CoreQuestionResponse } from './core_ques_resp.model';

@Table({
  tableName: 'prop_ques_resp',
})
export class PropQuesResp extends Model<PropQuesResp> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  // @IsNotEmpty()
  // @ForeignKey(() => Participants)
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // participant_id: string;

  // @BelongsTo(() => Participants)
  // participant: Participants;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  response: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  question_text: string;

  @BelongsTo(() => CoreQuestionResponse)
  core_ques_resp: CoreQuestionResponse;

  @IsNotEmpty()
  @ForeignKey(() => CoreQuestionResponse)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  core_ques_id: string;

  // @IsNotEmpty()
  // @ForeignKey(() => Assessments)
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // assessment_id: string;

  // @BelongsTo(() => Assessments)
  // assessment: Assessments;

  // @ForeignKey(() => ParticipantsAssessments)
  // @Column({
  //   type: DataType.STRING,
  //   // allowNull: false,
  // })
  // par_ass_id: string;
  // @BelongsTo(() => ParticipantsAssessments, { as: 'par_as' })
  // par_ass: ParticipantsAssessments;

  // @IsNotEmpty()
  // @ForeignKey(() => Competencies)
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // competency_id: string;

  // @BelongsTo(() => Competencies, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // competency: Competencies;

  // @IsNotEmpty()
  // @ForeignKey(() => Quessionnaires)
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // quessionaire_id: string;

  // @BelongsTo(() => Quessionnaires, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // quessionaire: Quessionnaires;
}
