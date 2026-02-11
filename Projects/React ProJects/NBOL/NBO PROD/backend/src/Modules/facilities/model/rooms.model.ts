import {
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
  BelongsTo,
  Index,
  IsUUID,
  Default,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import { Facilities } from './facility.model';
import { ParticipantsAssessments } from '../../class-configration/model/participantAssessments.model';
import { IsString } from 'class-validator';
import { GroupActivityRooms } from 'src/Modules/class-configration/model/groupActivityRooms.model';
import { PreClassSchedule } from 'src/Modules/class-configration/model/preClassSchedule.model';
@Table({
  tableName: 'rooms',
})
export class Rooms extends Model<Rooms> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @IsString()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  room: string;

  @Column({
    type: DataType.INTEGER,
  })
  sequence: number;

  @IsString()
  @ForeignKey(() => Facilities)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  facility_id: string;

  @BelongsTo(() => Facilities)
  facility: Facilities;

  @HasMany(() => ParticipantsAssessments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  participants_assessments: ParticipantsAssessments[];

  @HasMany(() => GroupActivityRooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  grp_act_rooms: GroupActivityRooms[];

   @HasMany(() => PreClassSchedule)
    pre_class: PreClassSchedule[];
}
