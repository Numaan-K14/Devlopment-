import {
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
  BelongsTo,
  HasMany,
  Index,
  IsUUID,
  Default,
  PrimaryKey,
  IsDate,
} from 'sequelize-typescript';
import { Clients } from '../clients/model/clients.model';
import { Participants } from '../participants/model/participants.model';
import { Facilities } from '../facilities/model/facility.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { Cohorts } from '../project-cohort/model/cohort.model';
import { NbolLeadLevels } from '../nbol-leadershiplevels/model/leadLevel.model';
import { Quessionnaires } from '../assessment/model/quessionnaire.model';
import { ClassDraft } from '../class-configration/model/classDraft.model';
import { Coaching } from '../coaching-sessions/model/coaching.model';
import { CompetencyWeightage } from '../competencies/model/competency_weightage.model';
import { ScheduleDraft } from '../class-configration/model/scheduleDraft.model';

@Table({
  tableName: 'projects',
})
export class Projects extends Model<Projects> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    // unique: true,
  })
  project_name: string;

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

  @ForeignKey(() => NbolLeadLevels)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nbol_ll_id: string;

  @BelongsTo(() => NbolLeadLevels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  nbol: NbolLeadLevels;

  @HasMany(() => Cohorts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cohorts: Cohorts[];

  @HasMany(() => Quessionnaires, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quessionnaires: Quessionnaires[];

  @HasMany(() => Participants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  participants: Participants[];

  @Column({
    type: DataType.DATE,
    // allowNull: false,  // uncomment it
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
    // allowNull: false,
  })
  end_date: Date;

  @HasMany(() => ClassDraft, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class_draft: ClassDraft[];

  @HasMany(() => Coaching, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  coaching: Coaching[];

  @HasMany(() => CompetencyWeightage)
  comp_weight_pr: CompetencyWeightage[];

  @HasMany(() => ScheduleDraft)
    sched_draft: ScheduleDraft[];

  // @HasMany(() => Facilities, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // facility: Facilities[];   -  - - -  - -  to be discussed with the team
}
