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
  // @IsUUID()
  // @IsString()
  // @IsNotEmpty()
  // id: string;

  // @IsString()
  // @IsNotEmpty()
  // question: string;

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
  participant_id: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  assessor_id: string;

  @IsString()
  @IsNotEmpty()
  assessment_id: string;

  @IsString()
  @IsNotEmpty()
  class_id: string;
}

export class CreateQuessionnaireResponseDto {
  @IsString()
  @IsNotEmpty()
  is_draft: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuessionnaireResponseItemDto)
  data: QuessionnaireResponseItemDto[];
}
