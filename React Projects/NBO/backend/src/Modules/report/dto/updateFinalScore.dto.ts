import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateFinalScore {
  @IsString()
  @IsNotEmpty()
  participant_id: string;

  @IsString()
  @IsNotEmpty()
  admin_score: string;

  @IsString()
  @IsNotEmpty()
  class_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Score)
  score: Score[];
}

class Score {
  @IsNotEmpty()
  @IsString()
  score_id: string;

  @IsNotEmpty()
  @IsString()
  competency_id: string;

  @IsNotEmpty()
  @IsString()
  assessment_response: string;

  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  score: string;
}
