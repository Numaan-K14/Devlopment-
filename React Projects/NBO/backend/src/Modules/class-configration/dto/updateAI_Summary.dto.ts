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
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsOptional()
  competency_id: string;
}

export class UpdateAssessmentAISummaryDto {
  @IsString()
  @IsNotEmpty()
  assessment_response_id: string;

  @IsString()
  @IsNotEmpty()
  commentary: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateScoreDto)
  response_score: UpdateScoreDto[];
}
