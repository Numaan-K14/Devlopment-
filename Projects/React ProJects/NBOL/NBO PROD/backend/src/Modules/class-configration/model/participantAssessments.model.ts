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
import { Participants } from 'src/Modules/participants/model/participants.model';
import { ClassAssessors } from './classPartAssessmAssessors.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Class } from './class.model';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { AssessmentResponse } from './participantsAssessmentsResponse.model';
import { QuessionnaireResponse } from './participantQuessionaireResponse.model';
import { ClientAssessments } from 'src/Modules/assessment/model/client-assessments.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { QuessionnaireResponseItemDto } from '../dto/updateAssessQuessResponse.dto';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';

export enum progressStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}

@Table({
  tableName: 'participant_assessments',
})
export class ParticipantsAssessments extends Model<ParticipantsAssessments> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @IsString()
  @IsNotEmpty()
  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  class_id: string;

  @IsString()
  @IsNotEmpty()
  @ForeignKey(() => Assessments)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessment_id: string;

  @IsString()
  @IsNotEmpty()
  @ForeignKey(() => Participants)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  participant_id: string;

  @ForeignKey(() => Rooms)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  room_id: string;

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

  // @ForeignKey(() => Assessros)
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // assessor_id: string;
  // --------------------------------------------
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  //   // get() {
  //   //   return this.getDataValue('start_time');
  //   // },
  //   // set(value: string) {
  //   //   this.setDataValue('start_time', value);
  //   // },
  // })
  // start_time: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  //   // get() {
  //   //   return this.getDataValue('end_time');
  //   // },
  //   // set(value: string) {
  //   //   this.setDataValue('end_time', value);
  //   // },
  // })
  // end_time: string;

  @IsNotEmpty()
  @Column({
    type: DataType.STRING,
    // allowNull: false,
    // get() {
    //   const value = this.getDataValue('start_time');
    //   return value;
    // },
    // set(value: string) {
    //   if (/^\d{2}:\d{2}$/.test(value)) {
    //     this.setDataValue('start_time', value);
    //   } else if (!isNaN(Date.parse(value))) {
    //     const date = new Date(value);
    //     const hours = String(date.getHours()).padStart(2, '0');
    //     const minutes = String(date.getMinutes()).padStart(2, '0');
    //     this.setDataValue('start_time', `${hours}:${minutes}`);
    //   }
    //   // else {
    //   //   throw new Error('Invalid start_time format.');
    //   // }
    // },
  })
  start_time: string;

  @IsNotEmpty()
  @Column({
    type: DataType.STRING,
    // allowNull: false,
    // get() {
    //   const value = this.getDataValue('end_time');
    //   return value;
    // },
    // set(value: string) {
    //   if (/^\d{2}:\d{2}$/.test(value)) {
    //     this.setDataValue('end_time', value);
    //   } else if (!isNaN(Date.parse(value))) {
    //     const date = new Date(value);
    //     const hours = String(date.getHours()).padStart(2, '0');
    //     const minutes = String(date.getMinutes()).padStart(2, '0');
    //     this.setDataValue('end_time', `${hours}:${minutes}`);
    //   }
    //   // else {
    //   //   throw new Error('Invalid end_time format.');
    //   // }
    // },
  
  })
  end_time: string;

  @IsBoolean()
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  assess_now: boolean;

  // -------------------------------------------------------
  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  break: string | null;

  @BelongsTo(() => Participants)
  participant: Participants;

  // @BelongsTo(() => Assessros)
  // assessor: Assessros;

  @BelongsToMany(() => Assessros, () => ClassAssessors)
  assessors: Assessros[];

  @BelongsTo(() => Assessments)
  assessment: Assessments;

  @BelongsTo(() => Rooms)
  room: Rooms;

  @BelongsTo(() => Class)
  class: Class;
  // --------------------------------------------
  @HasMany(() => ClassAssessors, {
    foreignKey: 'participant_assessment_id',
    onDelete: 'CASCADE',
  })
  class_assessors: ClassAssessors[];

  // @HasMany(()=> AssessmentResponse)
  // assessment_response: AssessmentResponse[];

  @HasMany(() => AssessmentResponse, { as: 'as_res' })
  as_res: AssessmentResponse[];

  // @HasMany(() => QuessionnaireResponse, { as: 'par_qs_res' })
  // par_qs_res: QuessionnaireResponse[];

  @HasOne(() => ClientAssessments, {
    foreignKey: 'assessment_id',
    onDelete: 'CASCADE',
  })
  client_assessment: ClientAssessments;

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

  @ForeignKey(() => Quessionnaires)
  @Column({
    type: DataType.STRING,
  })
  quessionnaire_id: string;

  @BelongsTo(() => Quessionnaires, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quessionnaire: Quessionnaires;


}
