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
// import { Projects } from "src/client_project/project.model";
import { Clients } from '../../clients/model/clients.model';
import { ParticipantsAssessments } from '../../class-configration/model/participantAssessments.model';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { AssessmentResponse } from 'src/Modules/class-configration/model/participantsAssessmentsResponse.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';
import { Users } from 'src/Modules/users/model/user.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { ClassPartReport } from 'src/Modules/report/model/class_part_report.model';
import { ClientRoles } from 'src/Modules/client-roles-levels/model/role.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { Projects } from 'src/Modules/client-project/project.model';
import {
  GroupActivityPart,
  progressStatus,
} from 'src/Modules/class-configration/model/groupActivityParticipants.model';
import { Coaching } from 'src/Modules/coaching-sessions/model/coaching.model';
import { PreClassSchedule } from 'src/Modules/class-configration/model/preClassSchedule.model';
import { CbiReport } from 'src/Modules/ai_ques_resp/model/cbi_report.model';
import {
  cbiProgressStatus,
  CoreQuestionResponse,
} from 'src/Modules/ai_ques_resp/model/core_ques_resp.model';

@Table({
  tableName: 'participants',
})
export class Participants extends Model<Participants> {
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
  participant_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    // unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  perf1: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  perf2: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  perf3: string;

  @ForeignKey(() => ClientRoles)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  job_grade: string;

  @BelongsTo(() => ClientRoles)
  client_roles: ClientRoles;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  department: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  division: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date_of_joining: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date_of_birth: Date;

  @Column({
    type: DataType.STRING,
  })
  position: string;

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
  })
  admin_score: progressStatus;

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
  })
  cbi_score_submitted: progressStatus;

  // @IsNumber()
  // @IsNotEmpty()
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: false,
  // })
  // age: number;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  client_id: string;

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
  cohorts: Cohorts;

  @BelongsTo(() => Clients)
  client: Clients;

  @ForeignKey(() => Projects)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  project_id: string;

  @Default(cbiProgressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(cbiProgressStatus)),
  })
  cbi_status: cbiProgressStatus;

  @BelongsTo(() => Projects)
  project: Projects;

  @HasMany(() => ParticipantsAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  par_as: ParticipantsAssessments[];
  //-----

  @HasMany(() => AssessmentResponse)
  assessment_response: AssessmentResponse[];

  // @HasOne(() => QuessionnaireResponse, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // quessionnaire_response: QuessionnaireResponse[];

  @HasOne(() => Users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Users[];

  @HasOne(() => ClassPartReport, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class_part_report: ClassPartReport;

  // @HasOne(() => forwardRef(() => CLassPartReport), {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // class_part_report: CLassPartReport;

  @HasMany(() => GroupActivityPart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  gr_act_part: GroupActivityPart[];

  @HasMany(() => Coaching, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  coaching: Coaching[];

  @HasMany(() => PreClassSchedule)
  pre_class: PreClassSchedule[];

  @HasOne(() => CbiReport, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cbi_report: CbiReport;

  @HasMany(() => CoreQuestionResponse)
  core_questions: CoreQuestionResponse[];
}
