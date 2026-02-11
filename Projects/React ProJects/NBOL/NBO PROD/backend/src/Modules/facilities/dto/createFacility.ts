import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { createRoom } from './createRoom';
import { Type } from 'class-transformer';

export class createFacility {
  @IsString()
  @IsNotEmpty()
  facility_name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  // @IsString()
  // @IsNotEmpty()
  // client_id: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => createRoom)
  rooms: createRoom[];
}
