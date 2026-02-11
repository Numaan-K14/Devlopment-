import {
  BelongsTo,
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
import { Clients } from 'src/Modules/clients/model/clients.model';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { Competencies } from './competency.model';
import { ExpectedBehaviours } from './expected_behaviour.model';
import { IsString } from 'class-validator';

@Table({
  tableName: 'nbol_client_competencies',
})
export class NbolClientCompetency extends Model<NbolClientCompetency> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => NbolLeadLevels)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nbol_id: string;

  @ForeignKey(() => Competencies)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ref_nbol_compt_id: string;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  client_id: string;

  @BelongsTo(() => Clients)
  client: Clients;

  @BelongsTo(() => NbolLeadLevels)
  nbol_leadership_level: NbolLeadLevels;

  @BelongsTo(() => Competencies)
  competency: Competencies;

  //   @HasMany(() => ExpectedBehaviours, {
  //     onDelete: 'CASCADE',
  //     onUpdate: 'CASCADE',
  //   })
  //   expected_behaviours: ExpectedBehaviours[];
}
