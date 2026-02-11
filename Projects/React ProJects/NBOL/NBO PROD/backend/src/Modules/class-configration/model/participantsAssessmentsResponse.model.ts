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
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Class } from './class.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { ParticipantsAssessments } from './participantAssessments.model';
import { ParticipantScore } from './participantScore.model';
import { text } from 'aws-sdk/clients/customerprofiles';
import { GroupActivityRooms } from './groupActivityRooms.model';
import { AssessorsMeetScore } from './assessorsMeetScore.model';
import { AdminScore } from './adminFinalScore.model';
import { QuessionnaireResponse } from './participantQuessionaireResponse.model';

export enum progressStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}
@Table({
  tableName: 'assessments_response',
})
export class AssessmentResponse extends Model<AssessmentResponse> {
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
    // allowNull: false,
  })
  commentary: string;

  @IsString()
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  audio_file: string;

  @IsString()
  @Column({
    type: DataType.TEXT,
    // allowNull: false,
  })
  grp_act_remark: string;

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
    defaultValue: true,
  })
  status: progressStatus;

  @IsNotEmpty()
  @ForeignKey(() => Assessments)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessment_id: string;

  @BelongsTo(() => Assessments)
  assessment: Assessments;

  @IsNotEmpty()
  @ForeignKey(() => Participants)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  participant_id: string;

  @BelongsTo(() => Participants)
  participant: Participants;

  @IsNotEmpty()
  @ForeignKey(() => Assessros)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  assessor_id: string;

  @BelongsTo(() => Assessros)
  assessor: Assessros;

  @IsNotEmpty()
  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  class_id: string;

  @BelongsTo(() => Class)
  class: Class;

  @HasMany(() => ParticipantScore, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scores: ParticipantScore[];
  // ----------------------------

  @ForeignKey(() => ParticipantsAssessments)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  par_ass_id: string;
  @BelongsTo(() => ParticipantsAssessments, { as: 'par_as' })
  par_ass: ParticipantsAssessments;

  @ForeignKey(() => GroupActivityRooms)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  gr_act_room_id: string;
  @BelongsTo(() => GroupActivityRooms, {
    as: 'gr_act_room',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  gr_act_room: GroupActivityRooms;

  @HasMany(() => AssessorsMeetScore, {
    as:'score_from_assessment',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assessor_sc: AssessorsMeetScore[];

  @HasMany(() => AdminScore)
  admin_score: AdminScore[];

   @HasMany(() => QuessionnaireResponse)
  quess_resp: QuessionnaireResponse[];
}
