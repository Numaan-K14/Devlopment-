import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Unique } from 'sequelize-typescript';

export class createParticipants {
  @IsString()
  @IsNotEmpty()
  participant_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  job_grade: string;

  @IsString()
  @IsNotEmpty()
  cohort_id: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  // @IsOptional()
  @IsNotEmpty()
  project_id: string;

  @IsString()
  @IsNotEmpty()
  perf1: string;

  @IsString()
  @IsOptional()
  perf2: string;

  @IsString()
  @IsOptional()
  perf3: string;

  @IsString()
  @IsOptional()
  department: string;

   @IsString()
  @IsOptional()
  division: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date_of_joining: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date_of_birth: Date;

  // @IsString()
  // date_of_joining: string;

  // @IsNumber()
  // @IsNotEmpty()
  // age: number;

  @IsString()
  @IsNotEmpty()
  client_id: string;
}
