import { IsString } from 'class-validator';
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
import { Participants } from 'src/Modules/participants/model/participants.model';

@Table({
  tableName: 'client_roles',
})
export class ClientRoles extends Model<ClientRoles> {
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
  role: string;

  @ForeignKey(() => NbolLeadLevels)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nbol_id: string;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  client_id: string;

  @BelongsTo(() => NbolLeadLevels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  nbol: NbolLeadLevels;

  @BelongsTo(() => Clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client: Clients;

  @HasMany(() => Participants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  participants: Participants[];
}
