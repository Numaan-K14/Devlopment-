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
import { cbiProgressStatus } from './core_ques_resp.model';

@Table({
  tableName: 'cbi_report',
})
export class CbiReport extends Model<CbiReport> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: string;

  @IsNotEmpty()
  @ForeignKey(() => Participants)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  participant_id: string;

  @BelongsTo(() => Participants)
  participant: Participants;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  overall_score: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  overall_scale: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  strengths: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  development_areas: any;
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  recommendations: any;
  
  @Default(cbiProgressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(cbiProgressStatus)),
  })
  is_report_submitted: cbiProgressStatus;
}
