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
import { Participants } from 'src/Modules/participants/model/participants.model';
import { GroupActivityRooms } from './groupActivityRooms.model';

export enum progressStatus {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}

@Table({
  tableName: 'group_activity_part',
})
export class GroupActivityPart extends Model<GroupActivityPart> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => Participants)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  part_id: string;

  @ForeignKey(() => GroupActivityRooms)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gr_act_room_id: string;

  @BelongsTo(() => Participants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  participants: Participants;

  @BelongsTo(() => GroupActivityRooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  gr_act_rooms: GroupActivityRooms;
}
