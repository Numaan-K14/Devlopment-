import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import {
  Model,
  Column,
  DataType,
  Default,
  Index,
  IsUUID,
  PrimaryKey,
  Table,
  Unique,
  BeforeSave,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { all } from 'axios';

export enum UserRole {
  ADMIN = 'admin',
  PARTICIPANT = 'participant',
  ASSESSOR = 'assessor',
}
@Table({
  tableName: 'users',
})
export class Users extends Model<Users> {
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
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    // unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  otp: number;

  @Default(UserRole.ADMIN)
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  role: UserRole;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  client_id: string;

  @ForeignKey(() => Assessros)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  assessor_id: string;

  @ForeignKey(() => Participants)
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  participant_id: string;
  
  @BelongsTo(() => Clients)
  client: Clients;

  @BelongsTo(() => Assessros)
  assessor: Assessros;

  @BelongsTo(() => Participants)
  participants: Participants;
}
