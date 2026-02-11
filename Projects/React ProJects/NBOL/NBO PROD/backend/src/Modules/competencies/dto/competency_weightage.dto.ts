import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsArray,
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { createExpectedBehaviour } from 'src/Modules/competencies/dto/create_expected_behaviour.dto';

export class createCompWeightage {
  @IsBoolean()
  submitted: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssessmentDto)
  assessment: AssessmentDto[];
}

export class AssessmentDto {
  @IsString()
  @IsNotEmpty()
  assessment_id: string;

  @IsOptional()
  @IsString()
  scenerio_id: string;

  @IsOptional()
  @IsString()
  quessionnaire_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompetencyDto)
  competency: CompetencyDto[];
}

export class CompetencyDto {
  @IsString()
  @IsNotEmpty()
  competency_id: string;

  @IsOptional()
  @IsString()
  weightage: string;

  @IsOptional()
  @IsString()
  total: string;
}
