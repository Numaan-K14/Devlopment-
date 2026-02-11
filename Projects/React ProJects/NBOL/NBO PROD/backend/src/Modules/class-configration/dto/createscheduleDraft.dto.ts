import { Type } from 'class-transformer';
import {
  IsDate,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateScheduleDraft {
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
  schedule_data: any;

  @IsNumber()
  @IsOptional()
  normal_assess_duration: number;

  @IsOptional()
  @IsNumber()
  grp_act_assess_duration: number;

  @IsOptional()
  @IsString()
  cbi_assessment_id: string;

  @IsOptional()
  @IsString()
  cbi_quessionnaire_id: string;

  @IsOptional()
  @IsNumber()
  cbi_assess_duration: number;

  @IsNumber()
  @IsOptional()
  welcome_sess_duration: number;
}
