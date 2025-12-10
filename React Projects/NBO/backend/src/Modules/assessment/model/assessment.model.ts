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
import { Scenerios } from './scenerio.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { ClientAssessments } from './client-assessments.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { ClassAssessments } from 'src/Modules/class-configration/model/classAsessments.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { ClassCompetencies } from 'src/Modules/class-configration/model/classAssessmentsCompetencies';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { AssessmentResponse } from 'src/Modules/class-configration/model/participantsAssessmentsResponse.model';
import { Quessionnaires } from './quessionnaire.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';
import { GroupActivityRooms } from 'src/Modules/class-configration/model/groupActivityRooms.model';
import { CompetencyWeightage } from 'src/Modules/competencies/model/competency_weightage.model';
import { PreClassSchedule } from 'src/Modules/class-configration/model/preClassSchedule.model';

@Table({
  tableName: 'assessments',
})
export class Assessments extends Model<Assessments> {
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
  assessment_name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_quesionnaire: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_group_activity: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_cbi: boolean;

  @HasMany(() => Scenerios, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scenerios: Scenerios[];

  @BelongsToMany(() => Clients, () => ClientAssessments)
  clients: Clients[];

  @HasMany(() => ClientAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client_assessments: ClientAssessments[];

  // @BelongsToMany(() => Class, () => ClassAssessments)
  // class_assessments: Class[];

  @HasMany(() => ParticipantsAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  participant_assessments: ParticipantsAssessments[];

  // @HasMany(() => ClassCompetencies, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // class_competencies: ClassCompetencies[];

  @HasMany(() => ClassAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class_assessments: ClassAssessments[];

  @BelongsToMany(() => Competencies, () => ClassCompetencies)
  competencies: Competencies[];
  // ----------------

  @HasMany(() => Quessionnaires, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  questions: Quessionnaires[];

  // @HasMany(() => QuessionnaireResponse, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // quessionnaire_response: QuessionnaireResponse[];

  @HasMany(() => AssessmentResponse, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  as_res: AssessmentResponse[];

  @HasMany(() => GroupActivityRooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  gr_act_rooms: GroupActivityRooms[];

  @HasMany(() => CompetencyWeightage)
  comp_weight_as: CompetencyWeightage[];

  @HasMany(() => PreClassSchedule)
  pre_class: PreClassSchedule[];
}
