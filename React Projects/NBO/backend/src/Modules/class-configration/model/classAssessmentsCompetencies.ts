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
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { Class } from './class.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { ClassAssessmentDto } from '../dto/createClass.dto';
import { ClassAssessments } from './classAsessments.model';
import { ParticipantsAssessments } from './participantAssessments.model';
import { IsNotEmpty, IsString } from 'class-validator';

@Table({
  tableName: 'class_competencies',
})
export class ClassCompetencies extends Model<ClassCompetencies> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @IsString()
  @IsNotEmpty()
  @ForeignKey(() => Assessments)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assessment_id: string;

  @IsString()
  @IsNotEmpty()
  @ForeignKey(() => Competencies)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  competency_id: string;

  @IsString()
  @IsNotEmpty()
  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  class_id: string;

  @BelongsTo(() => Class)
  class_configration: Class;

  @BelongsTo(() => Competencies)
  competency: Competencies[];
}
