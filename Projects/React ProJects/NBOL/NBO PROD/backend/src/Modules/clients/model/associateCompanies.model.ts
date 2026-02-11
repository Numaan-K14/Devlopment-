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
import { Clients } from './clients.model';

@Table({
  tableName: 'associate_companies',
})
export class AssociateCompanies extends Model<AssociateCompanies> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
  })
  client_id: string;

  @BelongsTo(() => Clients, {
    as: 'client',
    foreignKey: 'client_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client: Clients;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
  })
  assoc_comp: string;

  @BelongsTo(() => Clients, {
    as: 'assoc_client',
    foreignKey: 'assoc_comp',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assoc_company: Clients;
}
