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
import { Class } from './class.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';

@Table({
  tableName: 'class_breaks',
})
export class ClassBreaks extends Model<ClassBreaks> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING,
  })
  class_id: string;
  @BelongsTo(() => Class, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class: Class;

  @ForeignKey(() => Cohorts)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cohort_id: string;
  @BelongsTo(() => Cohorts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cohort: Class;

  @Column({
    type: DataType.STRING,
  })
  first_br_st: string;

  @Column({
    type: DataType.STRING,
  })
  first_br_en: string;

  @Column({
    type: DataType.STRING,
  })
  second_br_st: string;

  @Column({
    type: DataType.STRING,
  })
  second_br_en: string;

  @Column({
    type: DataType.STRING,
  })
  lunch_br_st: string;

  @Column({
    type: DataType.STRING,
  })
  lunch_br_en: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  class_date: Date;

  @Column({
    type: DataType.STRING,
  })
  wlc_sess_st: string;

  @Column({
    type: DataType.STRING,
  })
  wlc_sess_en: string;

  @Column({
    type: DataType.STRING,
  })
  ending_sess_st: string;

  @Column({
    type: DataType.STRING,
  })
  ending_sess_en: string;
}
