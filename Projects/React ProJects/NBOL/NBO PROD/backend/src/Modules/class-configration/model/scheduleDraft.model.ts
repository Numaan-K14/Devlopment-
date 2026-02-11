import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Index,
  IsDate,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Facilities } from 'src/Modules/facilities/model/facility.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { Projects } from 'src/Modules/client-project/project.model';

export enum progressStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}
@Table({
  tableName: 'schedule_draft',
})
export class ScheduleDraft extends Model<ScheduleDraft> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  client_id: string;
  @BelongsTo(() => Clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client: Clients;

  @ForeignKey(() => Projects)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  project_id: string;
  @BelongsTo(() => Projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project: Projects;

  @ForeignKey(() => Cohorts)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  cohort_id: string;
  @BelongsTo(() => Cohorts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cohort: Cohorts;

  @ForeignKey(() => Facilities)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  facility_id: string;
  @BelongsTo(() => Facilities, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  facility: Facilities;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  end_date: Date;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  schedule_data: any;

   @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  normal_assess_duration: number;

   @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  grp_act_assess_duration: number;

   @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  cbi_assess_duration: number;

   @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  welcome_sess_duration: number;

   @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  cbi_assessment_id: string;

    @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  cbi_quessionnaire_id: string;

  @Default(progressStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(progressStatus)),
  })
  status: progressStatus;
}
