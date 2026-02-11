import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  HasMany,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { ClassAssessors } from 'src/Modules/class-configration/model/classPartAssessmAssessors.model';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Users } from 'src/Modules/users/model/user.model';
import { AssessmentResponse } from 'src/Modules/class-configration/model/participantsAssessmentsResponse.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';
import { GroupActivityRooms } from 'src/Modules/class-configration/model/groupActivityRooms.model';
import { Coaching } from 'src/Modules/coaching-sessions/model/coaching.model';
import { AssessorsMeetScore } from 'src/Modules/class-configration/model/assessorsMeetScore.model';
import { ClassPartReport } from 'src/Modules/report/model/class_part_report.model';

@Table({
  tableName: 'assessors',
})
export class Assessros extends Model<Assessros> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessor_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  credential: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  status: boolean;

  @BelongsToMany(() => ParticipantsAssessments, () => ClassAssessors)
  assessors: ParticipantsAssessments[];

  @HasMany(() => Users, {
    // onDelete: 'CASCADE',
    // onUpdate: 'CASCADE',
  })
  users: Users[];

  // @HasMany(()=> ParticipantsAssessments)
  // participant_assessors: ParticipantsAssessments[]

  @HasMany(() => AssessmentResponse)
  assessment_response: AssessmentResponse[];

  // @HasMany(() => QuessionnaireResponse)
  // quessionnaire_response: QuessionnaireResponse[];

  @HasMany(() => GroupActivityRooms)
  gr_act_room: GroupActivityRooms[];

  @HasMany(() => ClassAssessors)
  class_assessors: ClassAssessors[];

  @HasMany(() => Coaching, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  coaching: Coaching[];

  @HasMany(() => AssessorsMeetScore, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  as_sc: AssessorsMeetScore[];

  @HasMany(() => ClassPartReport, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class_part_report: ClassPartReport[];
}
