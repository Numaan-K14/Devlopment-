import {
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
import { Assessments } from './assessment.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { ClientAssessments } from './client-assessments.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { GroupActivityRooms } from 'src/Modules/class-configration/model/groupActivityRooms.model';
import { CompetencyWeightage } from 'src/Modules/competencies/model/competency_weightage.model';
import { PreClassSchedule } from 'src/Modules/class-configration/model/preClassSchedule.model';

@Table({
  tableName: 'scenerios',
})
export class Scenerios extends Model<Scenerios> {
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
  scenerio_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    // allowNull: false,
  })
  file_location: string;

  @ForeignKey(() => Assessments)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessment_id: string;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  class_id?: string | null;

  @BelongsTo(() => Assessments)
  assessment: Assessments;

  @BelongsTo(() => Class)
  class: Class;

  @HasMany(() => ClientAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client_assessment: ClientAssessments[];

   @HasMany(() => ParticipantsAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  part_assessment: ParticipantsAssessments[];

   @HasMany(() => GroupActivityRooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  gr_act_rooms: GroupActivityRooms[];

   @HasMany(() => CompetencyWeightage)
  comp_wt_sc: CompetencyWeightage[];

   @HasMany(() => PreClassSchedule)
    pre_class: PreClassSchedule[];
}
