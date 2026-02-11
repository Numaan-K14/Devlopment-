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
import { Contactperson } from '../../client-contact-persons/contactPerson.model';
// import { Projects } from 'src/client_project/project.model';
import { Participants } from '../../participants/model/participants.model';
import { Competencies } from '../../competencies/model/competency.model';
import { Assessments } from '../../assessment/model/assessment.model';
import { ClientAssessments } from '../../assessment/model/client-assessments.model';
import { NbolClientCompetency } from '../../competencies/model/nbol_client_competency.model';
import { Class } from '../../class-configration/model/class.model';
import { ClientRoles } from '../../client-roles-levels/model/role.model';
import { Facilities } from 'src/Modules/facilities/model/facility.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { Users } from 'src/Modules/users/model/user.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { Tenant } from 'src/Modules/nbol_360_data/model/tenants.model';
import { HttpException } from '@nestjs/common';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { ClassDraft } from 'src/Modules/class-configration/model/classDraft.model';
import { Coaching } from 'src/Modules/coaching-sessions/model/coaching.model';
import { AssociateCompanies } from './associateCompanies.model';
import { CompetencyWeightage } from 'src/Modules/competencies/model/competency_weightage.model';
import { ScheduleDraft } from 'src/Modules/class-configration/model/scheduleDraft.model';

@Table({
  tableName: 'clients',
})
export class Clients extends Model<Clients> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    // validate: {
    //   notEmpty: {
    //     msg: `Client name cannot be empty`,
    //   },
    // },
  })
  client_name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_360_client: boolean;

  @Column({
    type: DataType.STRING,
  })
  nbol_client_name: string;

  @Column({
    type: DataType.STRING,
  })
  nbol_client_schema: string;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.STRING,
  })
  nbol_client_id: string;

  // @BelongsTo(()=> Tenant)
  // tenant: Tenant;

  @Column({
    type: DataType.STRING,
  })
  logo: string;

  @HasMany(() => Projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  projects: Projects[];

  @HasMany(() => Facilities, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  facilities: Facilities[];

  @HasMany(() => Contactperson, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  contact_persons: Contactperson[];

  @HasMany(() => Participants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  participants: Participants[];

  @HasMany(() => ClientRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roles: ClientRoles[];

  @HasMany(() => Competencies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  competencies: Competencies[];

  @HasMany(() => NbolClientCompetency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  nbol_client_competencies: NbolClientCompetency[];

  @BelongsToMany(() => Assessments, () => ClientAssessments)
  assessments: Assessments[];

  @HasMany(() => Class, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  classes: Class[];

  @HasMany(() => Users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: Users[];

  @HasMany(() => Quessionnaires, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quessionnaire: Quessionnaires[];

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

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_grp_comp: boolean;

  @HasMany(() => AssociateCompanies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assoc_companies: AssociateCompanies[];

   @HasMany(() => CompetencyWeightage)
  comp_weight_cl: CompetencyWeightage[];

    @HasMany(() => ScheduleDraft)
  sched_draft: ScheduleDraft[];
}
