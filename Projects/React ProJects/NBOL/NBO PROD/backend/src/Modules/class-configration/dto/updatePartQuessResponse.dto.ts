import { Type } from 'class-transformer';
import {
  IsArray,
  isArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdatePartQuessResp {
   @IsString()
  @IsNotEmpty()
  is_draft: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  assessment_id: string;

   @IsString()
  @IsNotEmpty()
  participant_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Response)
  response: Response[];
}

export class Response {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  response: string;

  @IsString()
  @IsNotEmpty()
  question_id: string;

  @IsString()
  @IsNotEmpty()
  quessionaire_id: string;

  @IsString()
  @IsNotEmpty()
  assessm_resp_id: string;

  @IsString()
  @IsNotEmpty()
  competency_id: string;
}
