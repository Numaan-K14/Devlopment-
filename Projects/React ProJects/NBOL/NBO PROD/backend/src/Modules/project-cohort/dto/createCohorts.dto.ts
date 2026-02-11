import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCohorts {
  @IsString()
  @IsNotEmpty()
  cohort_name: string;
}
