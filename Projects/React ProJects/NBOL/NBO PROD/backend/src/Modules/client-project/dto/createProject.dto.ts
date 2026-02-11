import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createProject {
  @IsNotEmpty()
  @IsString()
  project_name: string;

  @IsNotEmpty()
  @IsString()
  client_id: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_date: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  end_date: string;

  @IsNotEmpty()
  @IsString()
  nbol_ll_id: string;
}
