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
import { Clients } from '../clients/model/clients.model';
import { IS_EMAIL, IsEmail, isEmail, IsString } from 'class-validator';

@Table({
  tableName: 'contact_persons',
})
export class Contactperson extends Model<Contactperson> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  mobile: string;

  @Column({
    type: DataType.STRING,
  })
  department: string;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  client_id: string;

  @BelongsTo(() => Clients)
  clients: Clients;
}
