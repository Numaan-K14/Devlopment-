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
  BelongsToMany,
} from 'sequelize-typescript';

import { IsNotEmpty, IsString } from 'class-validator';
import { Projects } from 'src/Modules/client-project/project.model';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { ClientAssessments } from 'src/Modules/assessment/model/client-assessments.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { ClassDraft } from 'src/Modules/class-configration/model/classDraft.model';
import { Coaching } from 'src/Modules/coaching-sessions/model/coaching.model';
import { CompetencyWeightage } from 'src/Modules/competencies/model/competency_weightage.model';
import { ScheduleDraft } from 'src/Modules/class-configration/model/scheduleDraft.model';
import { PreClassSchedule } from 'src/Modules/class-configration/model/preClassSchedule.model';
import { ClassBreaks } from 'src/Modules/class-configration/model/classBreaks.model';

@Table({
  tableName: 'cohorts',
})
export class Cohorts extends Model<Cohorts> {
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
  cohort_name: string;

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

  @Column({
    type: DataType.BOOLEAN,
  })
  class_exist: boolean;

  @HasMany(() => Participants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  participants: Participants[];

  @HasMany(() => Quessionnaires, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quessionnaires: Quessionnaires[];

  // @BelongsToMany(() => Assessments, () => ClientAssessments)
  // assessments: Assessments[];

  @HasMany(() => ClientAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client_ass: ClientAssessments;

  @HasMany(() => Class, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class: Class;
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
  comp_weight_co: CompetencyWeightage[];

  @HasMany(() => ScheduleDraft)
  sched_draft: ScheduleDraft[];

  // @IsString()
  // @IsNotEmpty()
  // @ForeignKey(() => NbolLeadLevels)
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // lead_level: string;

  // @BelongsTo(() => NbolLeadLevels)
  // nbol_level: NbolLeadLevels;

  // @HasMany(() => Facilities, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // facility: Facilities[];   -  - - -  - -  to be discussed with the team

  @HasMany(() => PreClassSchedule)
  pre_class: PreClassSchedule[];

  @HasMany(() => ClassBreaks)
  class_breaks: ClassBreaks[];
}
