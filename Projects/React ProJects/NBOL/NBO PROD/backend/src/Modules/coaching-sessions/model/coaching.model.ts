import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
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
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { ClassAssessors } from 'src/Modules/class-configration/model/classPartAssessmAssessors.model';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Users } from 'src/Modules/users/model/user.model';
import { AssessmentResponse } from 'src/Modules/class-configration/model/participantsAssessmentsResponse.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';
import { GroupActivityRooms } from 'src/Modules/class-configration/model/groupActivityRooms.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { Facilities } from 'src/Modules/facilities/model/facility.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';

export enum sessionstatus {
  INPERSON = 'inperson',
  VIRTUAL = 'virtual',
}
export enum commentStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}
@Table({
  tableName: 'coaching-sessions',
})
export class Coaching extends Model<Coaching> {
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

  @BelongsTo(() => Clients)
  client: Clients;

  @ForeignKey(() => Projects)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  project_id: string;

  @BelongsTo(() => Projects)
  project: Projects;

  @ForeignKey(() => Cohorts)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cohort_id: string;

  @BelongsTo(() => Cohorts)
  cohort: Cohorts;

  @ForeignKey(() => Participants)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  part_id: string;

  @BelongsTo(() => Participants)
  participant: Participants;

  @ForeignKey(() => Assessros)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessor_id: string;

  @BelongsTo(() => Assessros)
  assessor: Assessros;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    get() {
      const value = this.getDataValue('start_time');
      return value;
    },
    set(value: string) {
      if (/^\d{2}:\d{2}$/.test(value)) {
        this.setDataValue('start_time', value);
      } else if (!isNaN(Date.parse(value))) {
        const date = new Date(value);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        this.setDataValue('start_time', `${hours}:${minutes}`);
      }
    },
  })
  start_time: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    get() {
      const value = this.getDataValue('end_time');
      return value;
    },
    set(value: string) {
      if (/^\d{2}:\d{2}$/.test(value)) {
        this.setDataValue('end_time', value);
      } else if (!isNaN(Date.parse(value))) {
        const date = new Date(value);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        this.setDataValue('end_time', `${hours}:${minutes}`);
      }
    },
  })
  end_time: string;

  @Column({
    type: DataType.STRING,
  })
  vanue: string;

  @Column({
    type: DataType.TEXT,
  })
  comment: string;

  @Default(commentStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(commentStatus)),
    allowNull: false,
  })
  commentStatus: commentStatus;

  // @Default(sessionstatus.INPERSON)
  @Column({
    type: DataType.ENUM(...Object.values(sessionstatus)),
    allowNull: false,
  })
  session: sessionstatus;
}
