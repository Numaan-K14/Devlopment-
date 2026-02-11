import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class createClientAssessment {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => assessments)
  assessments: assessments[];
}
export class assessments {
  @IsString()
  @IsNotEmpty()
  assessment_id: string;

  @IsString()
  @IsOptional()
  scenerio_id: string;

  @IsString()
  @IsOptional()
  quesionnaire_id: string;
}
