import {
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
} from 'sequelize-typescript';
import { IsString } from 'class-validator';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { ClassPartReport } from './class_part_report.model';

@Table({
  tableName: 'part_avg_comp_score',
})
export class ParticipantAvgComp extends Model<ParticipantAvgComp> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  // @IsString()
  // @ForeignKey(() => Participants)
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // part_id: string;
  // @BelongsTo(() => Participants, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // participant: Participants[];

  @ForeignKey(() => Competencies)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  comp_id: string;
  @BelongsTo(() => Competencies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  competency: Competencies[];

  @ForeignKey(() => ClassPartReport)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  class_part_rep_id: string;
  @BelongsTo(() => ClassPartReport, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class_part_rep: ClassPartReport[];

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  average_score: string;

  @Column({
    type: DataType.TEXT,
  })
  strength: string;

  @Column({
    type: DataType.TEXT,
  })
  area_for_dev: string;
}
