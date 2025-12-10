import { ModelDefinition } from '@sequelize/core';
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Clients } from 'src/Modules/clients/model/clients.model';

@Table({
  tableName: 'tenants',
  modelName: 'Tenant',
  defaultScope: {
    order: [['createdAt', 'DESC']],
  },
  paranoid: true,
  timestamps: true,
})
export class Tenant extends Model<Tenant> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Name can not be empty',
      },
      notEmpty: {
        msg: 'Name can not be empty',
      },
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Schema name can not be empty',
      },
      notEmpty: {
        msg: 'Schema name can not be empty',
      },
    },
  })
  schema_name: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_channel_partner: boolean;

  // @HasOne(() => Clients)
  // clients: Clients[];
}
