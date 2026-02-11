import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class updateScenerioSummary {
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  cohort_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => assessments)
  assessments: assessments[];
}
class assessments {
  @IsString()
  @IsNotEmpty()
  id: string;

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
  @IsOptional()
  assessm_summary: string;
}
