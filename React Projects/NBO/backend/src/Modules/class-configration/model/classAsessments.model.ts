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
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Class } from './class.model';
import { Rooms } from 'src/Modules/facilities/model/rooms.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { ClassCompetencies } from './classAssessmentsCompetencies';
import { IsNotEmpty, IsString } from 'class-validator';

@Table({
  tableName: 'class_assessments',
})
export class ClassAssessments extends Model<ClassAssessments> {
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
  @ForeignKey(() => Class)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  class_id: string;

  @BelongsTo(() => Class)
  class: Class;

  @BelongsTo(() => Assessments)
  assessment: Assessments;
}
