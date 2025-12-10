import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProject {
  @IsOptional()
  @IsString()
  project_name: string;

  @IsOptional()
  @IsString()
  client_id?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start_date: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end_date: string;

  @IsOptional()
  @IsString()
  nbol_ll_id: string;
}
