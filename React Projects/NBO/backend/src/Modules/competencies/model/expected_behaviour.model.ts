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
import { Competencies } from './competency.model';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { NbolClientCompetency } from './nbol_client_competency.model';
import { IsNotEmpty, IsString, validate } from 'class-validator';

@Table({
  tableName: 'expected_behaviours',
})
export class ExpectedBehaviours extends Model<ExpectedBehaviours> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  expected_behaviour: string;

  @ForeignKey(() => Competencies)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  competency_id: string;

  @BelongsTo(() => Competencies)
  competency: Competencies;

  // @ForeignKey(()=> NbolLeadLevels)
  // @Column({
  //     type: DataType.STRING,
  //     allowNull: false
  // })
  // nbol_leadership_id: string

  // @BelongsTo(() => NbolClientCompetency)
  // compenbol_client_competenciestency: NbolClientCompetency;

  // @BelongsTo(()=> NbolLeadLevels)
  // nbol_leadership_levels: NbolLeadLevels
}
