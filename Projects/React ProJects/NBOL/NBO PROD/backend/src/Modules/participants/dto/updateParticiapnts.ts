import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class updateParticipants {
  @IsString()
  @IsOptional()
  participant_name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  job_grade: string;

  @IsString()
  @IsOptional()
  position: string;

  @IsString()
  @IsOptional()
  perf1: string;

  @IsString()
  @IsOptional()
  perf2: string;

  @IsString()
  @IsOptional()
  perf3: string;

  // @IsString()
  // @IsOptional()
  // lead_level: string;

  @IsString()
  @IsOptional()
  department: string;

  @IsString()
  @IsOptional()
  division: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date_of_joining: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date_of_birth: Date;

  // @IsNumber()
  // age: number;
}
