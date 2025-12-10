import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

class AvgCompUpdate {
  @IsUUID()
  @IsNotEmpty()
  avgCompId: string;

  @IsString()
  strength?: string;

  @IsString()
  area_for_dev?: string;
}

export class UpdateClassPartReportAndAvgCompDto {
  //   @IsUUID()
  //   @IsNotEmpty()
  //   classPartReportId: string;

  @IsString()
  strength?: string;

  @IsString()
  area_for_dev?: string;

  @IsString()
  summary?: string;

  @IsString()
  recommendation?: string;

  @IsString()
  conclusion?: string;

  @IsString()
  @IsOptional()
  str_comp?: string;

  @IsString()
  @IsOptional()
  dev_comp?: string;

  @IsOptional()
  @IsString()
  assessor_status?: string;

  @IsOptional()
  @IsString()
  admin_status?: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  assessor_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvgCompUpdate)
  avgCompUpdates: AvgCompUpdate[];
}
