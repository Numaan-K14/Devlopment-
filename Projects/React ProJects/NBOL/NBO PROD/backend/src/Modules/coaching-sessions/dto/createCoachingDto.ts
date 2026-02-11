import { Type } from 'class-transformer';
import {
  IS_EMAIL,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';

export class createCoachingSessions {
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  project_id: string;

  @IsString()
  @IsNotEmpty()
  cohort_id: string;

  @IsString()
  @IsNotEmpty()
  part_id: string;

  @IsString()
  @IsNotEmpty()
  assessor_id: string;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNotEmpty()
  start_time: string;

  @IsNotEmpty()
  end_time: string;

  @IsString()
  @IsOptional()
  vanue: string;

  @IsNotEmpty()
  @IsString()
  session: string;

  @IsNotEmpty()
  @IsString()
  assessor_email: string;

  @IsNotEmpty()
  @IsString()
  assessor_name: string;

  @IsNotEmpty()
  @IsString()
  part_email: string;

  @IsNotEmpty()
  @IsString()
  part_name: string;
}
