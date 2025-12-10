import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { text } from 'aws-sdk/clients/customerprofiles';

class Score {
  @IsString()
  @IsOptional()
  observation: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  summary: string;

  @IsString()
  @IsOptional()
  score: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  competency_id: string;

  @IsString()
  @IsOptional()
  response: string;

  @IsString()
  @IsOptional()
  question_id: string;

  @IsString()
  @IsOptional()
  quessionaire_id: string;
}

export class CreateAssessmentWithResponses {
  @IsString()
  @IsOptional()
  commentary: string;

  // @IsString()
  // @IsNotEmpty()
  // audio_file: string;

  @IsString()
  @IsNotEmpty()
  assessment_id: string;

  @IsString()
  @IsOptional()
  scenerio_id: string;

  @IsString()
  @IsOptional()
  quessionnaire_id: string;

  @IsString()
  @IsNotEmpty()
  class_id: string;

  @IsString()
  @IsNotEmpty()
  participant_id: string;

  @IsString()
  @IsNotEmpty()
  assessor_id: string;

  @IsNotEmpty()
  @IsOptional()
  is_draft: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  par_ass_id: string;
  
  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  gr_act_room_id: string;

  @IsString()
  @IsOptional()
  grp_act_remark: string;

  @IsString()
  @IsOptional()
  // @IsNotEmpty()
  role: string;

  @IsString()
  @IsOptional()
  over_all_obs: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Score)
  response_score: Score[];
}
