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
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { ParticipantsAssessments } from './participantAssessments.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { GroupActivityRooms } from './groupActivityRooms.model';

export enum IndivAssessorStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}
@Table({
  tableName: 'class_assessments_assessors',
})
export class ClassAssessors extends Model<ClassAssessors> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => ParticipantsAssessments)
  @Column({
    type: DataType.STRING,
  })
  participant_assessment_id: string;

  @ForeignKey(() => Assessros)
  @Column({
    type: DataType.STRING,
  })
  assessors_id: string;

  @ForeignKey(() => GroupActivityRooms)
  @Column({
    type: DataType.STRING,
  })
  gr_act_room: string;

  @Default(IndivAssessorStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(IndivAssessorStatus)),
  })
  assessor_status: string;

   @Column({
    type: DataType.TEXT,
  })
  over_all_obs: string;

  @BelongsTo(() => ParticipantsAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  participant_assessment: ParticipantsAssessments;

  @BelongsTo(() => Assessros, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assessor: Assessros;

  @BelongsTo(() => GroupActivityRooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  grp_act_room: GroupActivityRooms;
}
