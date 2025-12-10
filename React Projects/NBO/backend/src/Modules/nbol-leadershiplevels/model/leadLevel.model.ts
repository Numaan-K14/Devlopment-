import {
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
import { ClientRoles } from '../../client-roles-levels/model/role.model';
import { ExpectedBehaviours } from '../../competencies/model/expected_behaviour.model';
import { Competencies } from '../../competencies/model/competency.model';
import { NbolClientCompetency } from '../../competencies/model/nbol_client_competency.model';
import { IsString } from 'class-validator';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { Projects } from 'src/Modules/client-project/project.model';

@Table({
  tableName: 'leadership_levels',
})
export class NbolLeadLevels extends Model<NbolLeadLevels> {
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
  leadership_level: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // nbol_level_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

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

  @HasMany(() => ClientRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roles: ClientRoles[];

  // @HasMany(() => Cohorts, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // cohorts: Cohorts[];

  @HasMany(() => Projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  projects: Projects[];

  // @HasMany(()=> ExpectedBehaviours,{
  //   onDelete: 'CASCADE',
  //   onUpdate: "CASCADE"
  // })
  // expected_behaviour: ExpectedBehaviours[]
}
