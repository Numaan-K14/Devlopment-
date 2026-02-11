import { Type } from 'class-transformer';
import {
  IsDate,
  IsJSON,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateDraftDto {
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  project_id: string;

  @IsString()
  @IsNotEmpty()
  cohort_id: string;

  @IsNotEmpty()
  @IsString()
  facility_id: string;

  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  end_date: Date;

//   @IsObject()
  // @IsNotEmpty()
  class_data: any;
}
