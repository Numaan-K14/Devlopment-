import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateScoreDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  asser_sc_id: string;

  @IsString()
  @IsOptional()
  observation: string;

  @IsString()
  @IsOptional()
  score: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  summary: string;

  @IsString()
  @IsOptional()
  quess_response: string;

  @IsString()
  @IsOptional()
  question_id: string;

  @IsString()
  @IsOptional()
  quessionaire_id: string;

  @IsString()
  @IsOptional()
  quess_resp_id: string;
}

export class UpdateAssessmentWithResponsesDto {
  @IsString()
  @IsNotEmpty()
  assessment_response: string;

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
  participant_id: string;

  @IsString()
  @IsNotEmpty()
  class_id: string;

  @IsString()
  @IsNotEmpty()
  is_draft: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  grp_act_remark: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  assessor_id: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  par_ass_id: string;

   @IsString()
  @IsOptional()
  over_all_obs: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateScoreDto)
  response_score: UpdateScoreDto[];
}
