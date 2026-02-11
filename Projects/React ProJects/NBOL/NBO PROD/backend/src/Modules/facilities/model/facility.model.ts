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
import { Rooms } from './rooms.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { IsString } from 'class-validator';
import { ClassDraft } from 'src/Modules/class-configration/model/classDraft.model';
import { ScheduleDraft } from 'src/Modules/class-configration/model/scheduleDraft.model';
// import { Projects } from 'src/client_project/project.model';

@Table({
  tableName: 'facilities',
})
export class Facilities extends Model<Facilities> {
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
  facility_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  client_id: string;

  // @ForeignKey(() => Projects)
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // projectId: string;

  @HasMany(() => Rooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  room: Rooms[];

  @BelongsTo(() => Clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client: Clients;

  // @BelongsTo(()=> Projects,{
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // project: Projects;

  @HasOne(() => Class, {})
  classe: Class;

  @HasMany(() => ClassDraft, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class_draft: ClassDraft[];

  @HasMany(() => ScheduleDraft)
    sched_draft: ScheduleDraft[];
}
