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
import { IsString } from 'class-validator';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { ParticipantAvgComp } from './part_average_comp_score.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { forwardRef } from '@nestjs/common';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';

export enum progressStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}

export enum adminProgress {
  ACCEPT = 'accepted',
  REJECT = 'rejected',
  PENDING = 'pending',
}
@Table({
  tableName: 'class_part_report',
})
export class ClassPartReport extends Model<ClassPartReport> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.TEXT,
  })
  strength: string;

  @Column({
    type: DataType.TEXT,
  })
  part_summary: string;

  @Column({
    type: DataType.TEXT,
  })
  area_for_dev: string;

  @Column({
    type: DataType.TEXT,
  })
  recommendation: string;

  @Column({
    type: DataType.TEXT,
  })
  conclusion: string;

  @Column({
    type: DataType.TEXT,
  })
  str_comp: string;

  @Column({
    type: DataType.TEXT,
  })
  dev_comp: string;

  @ForeignKey(() => Participants)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  part_id: string;
  @BelongsTo(() => Participants)
  participant: Participants;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  class_id: string;
  @BelongsTo(() => Class)
  class: Class[];

  @HasMany(() => ParticipantAvgComp, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  par_avg_comp: ParticipantAvgComp[];

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
    defaultValue: progressStatus.PENDING,
  })
  assessor_status: progressStatus;

  @Default(adminProgress.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(adminProgress)),
    defaultValue: adminProgress.PENDING,
  })
  admin_status: adminProgress;

  @Column({
    type: DataType.STRING,
  })
  report_path: string;

  @Default('Admin Name')
  @Column({
    type: DataType.STRING,
  })
  admin_name: string;

  @ForeignKey(() => Assessros)
  @Column({
    type: DataType.STRING,
  })
  assessor_id: string;
  
  @BelongsTo(() => Assessros, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assessor: Assessros[];
}
