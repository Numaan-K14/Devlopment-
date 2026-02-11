import {
  BelongsTo,
  BelongsToMany,
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
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { Rooms } from 'src/Modules/facilities/model/rooms.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Class } from './class.model';
import { GroupActivityPart } from './groupActivityParticipants.model';
import { ClientAssessments } from 'src/Modules/assessment/model/client-assessments.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { AssessmentResponse } from './participantsAssessmentsResponse.model';
import { ClassAssessors } from './classPartAssessmAssessors.model';

export enum progressStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}

@Table({
  tableName: 'group_activity_rooms',
})
export class GroupActivityRooms extends Model<GroupActivityRooms> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => Rooms)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  room_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    // get() {
    //   const value = this.getDataValue('start_time');
    //   return value;
    // },
    // set(value: string) {
    //   if (/^\d{2}:\d{2}$/.test(value)) {
    //     this.setDataValue('start_time', value);
    //   } else if (!isNaN(Date.parse(value))) {
    //     const date = new Date(value);
    //     // Use local timezone methods to ensure consistent timezone handling
    //     const hours = String(date.getHours()).padStart(2, '0');
    //     const minutes = String(date.getMinutes()).padStart(2, '0');
    //     this.setDataValue('start_time', `${hours}:${minutes}`);
    //   } else {
    //     throw new Error('Invalid start_time format.');
    //   }
    // },
  })
  start_time: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    // get() {
    //   const value = this.getDataValue('end_time');
    //   return value;
    // },
    // set(value: string) {
    //   if (/^\d{2}:\d{2}$/.test(value)) {
    //     this.setDataValue('end_time', value);
    //   } else if (!isNaN(Date.parse(value))) {
    //     const date = new Date(value);
    //     // Use local timezone methods to ensure consistent timezone handling
    //     const hours = String(date.getHours()).padStart(2, '0');
    //     const minutes = String(date.getMinutes()).padStart(2, '0');
    //     this.setDataValue('end_time', `${hours}:${minutes}`);
    //   } else {
    //     throw new Error('Invalid end_time format.');
    //   }
    // },
  })
  end_time: string;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  class_id: string;

  @ForeignKey(() => Assessments)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessment_id: string;

  @ForeignKey(() => Assessros)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessor_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  assess_now: boolean;

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
    defaultValue: true,
  })
  assessor_status: progressStatus;

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
    defaultValue: true,
  })
  participant_status: progressStatus;

  @BelongsTo(() => Assessros)
  assessor: Assessros;

  @BelongsTo(() => Assessments)
  assessment: Assessments;

  @BelongsTo(() => Rooms)
  room: Rooms;

  @BelongsTo(() => Class)
  class: Class;

  @ForeignKey(() => Scenerios)
  @Column({
    type: DataType.STRING,
  })
  scenerio_id: string;

  @BelongsTo(() => Scenerios, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scenerio: Scenerios;

  @HasMany(() => GroupActivityPart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  gr_act_part: GroupActivityPart[];

  @HasOne(() => ClientAssessments, {
    foreignKey: 'assessment_id',
    onDelete: 'CASCADE',
  })
  client_assessment: ClientAssessments;

  @HasMany(() => AssessmentResponse, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  as_res: AssessmentResponse[];

  @HasMany(() => ClassAssessors, { as: 'class_assessors' })
  cl_assessor: ClassAssessors[];
}
