import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';

export class Score {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  quess_resp_id: string;

  @IsString()
  @IsOptional()
  score: string;
}

export class UpdateQuessRespAssessor {
  @IsString()
  @IsNotEmpty()
  assm_resp_id: string;

  @IsString()
  @IsNotEmpty()
  assessor_id: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  is_draft: string;

  @IsString()
  @IsNotEmpty()
  class_id: string;

  @IsString()
  @IsNotEmpty()
  assessment_id: string;

  @IsString()
  @IsNotEmpty()
  quessionnaire_id: string;

  @IsString()
  @IsNotEmpty()
  participant_id: string;

  @IsString()
  @IsOptional()
  par_ass_id: string;

  @IsString()
  @IsOptional()
  over_all_obs: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Score)
  response_score: Score[];
}
