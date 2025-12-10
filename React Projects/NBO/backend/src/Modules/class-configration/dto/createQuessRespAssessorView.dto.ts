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
  quess_resp_id: string;

  @IsString()
  @IsOptional()
  score: string;
}

export class CreateQuessRespAssessor {
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

//   @IsString()
//   @IsOptional()
//   gr_act_room_id: string;

//   @IsString()
//   @IsOptional()
//   scenerio_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Score)
  score: Score[];
}
