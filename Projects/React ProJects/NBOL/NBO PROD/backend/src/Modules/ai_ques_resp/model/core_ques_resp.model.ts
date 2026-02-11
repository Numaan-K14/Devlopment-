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
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { PropQuesResp } from './prop_ques_resp.model';

export enum cbiProgressStatus {
  PENDING = 'pending',
  PAUSED = 'paused',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}
@Table({
  tableName: 'core_question_resp',
})
export class CoreQuestionResponse extends Model<CoreQuestionResponse> {
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
    allowNull: true,
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
  @ForeignKey(() => Participants)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  participant_id: string;

  @BelongsTo(() => Participants)
  participant: Participants;

  @HasMany(() => PropQuesResp)
  prop_ques_resp: PropQuesResp[];

  @Default(cbiProgressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(cbiProgressStatus)),
    defaultValue: true,
  })
  status: cbiProgressStatus;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  behavior_alignment: any;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reasoning: any;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  sequence: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  rating: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  evidence: any;
}
