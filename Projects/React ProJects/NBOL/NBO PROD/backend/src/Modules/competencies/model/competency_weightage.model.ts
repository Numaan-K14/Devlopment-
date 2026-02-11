import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Competencies } from './competency.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';

@Table({
  tableName: 'competency_weightage',
})
export class CompetencyWeightage extends Model<CompetencyWeightage> {
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
  })
  cohort_id: string;

  @BelongsTo(() => Cohorts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cohort: Cohorts;

  @ForeignKey(() => Assessments)
  @Column({
    type: DataType.STRING,
  })
  assessment_id: string;

  @BelongsTo(() => Assessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assessm: Assessments;

  @ForeignKey(() => Scenerios)
  @Column({
    type: DataType.STRING,
  })
  scenerio_id: string;

  @BelongsTo(() => Scenerios, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  scenerio: Scenerios;

  @ForeignKey(() => Quessionnaires)
  @Column({
    type: DataType.STRING,
  })
  quessionnaire_id: string;

  @BelongsTo(() => Quessionnaires, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  quessionnaire: Quessionnaires;

  @ForeignKey(() => Competencies)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  comp_id: string;

  @BelongsTo(() => Competencies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comp: Competencies;

  @Column({
    type: DataType.STRING,
  })
  weightage: string;

  @Column({
    type: DataType.STRING,
  })
  total: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  submitted: boolean;
}
