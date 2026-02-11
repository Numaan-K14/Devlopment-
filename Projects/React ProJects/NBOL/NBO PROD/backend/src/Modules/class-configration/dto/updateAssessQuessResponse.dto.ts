import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';

export class QuessionnaireResponseItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  // @IsString()
  // @IsNotEmpty()
  // question: string;

  @IsString()
  @IsNotEmpty()
  response: string;

  @IsString()
  @IsNotEmpty()
  question_id: string;

  @IsString()
  @IsNotEmpty()
  quessionaire_id: string;

  @IsString()
  @IsNotEmpty()
  participant_id: string;

  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  assessor_id: string;

  @IsString()
  @IsNotEmpty()
  assessment_id: string;

  @IsString()
  @IsNotEmpty()
  class_id: string;

  @IsOptional()
  @IsString()
  remark: string;

  @IsOptional()
  @IsString()
  score: string;
}

export class UpdateQuessionnaireResponseDto {
  @IsString()
  @IsNotEmpty()
  is_draft: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuessionnaireResponseItemDto)
  data: QuessionnaireResponseItemDto[];
}
