import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { createExpectedBehaviour } from 'src/Modules/competencies/dto/create_expected_behaviour.dto';

export class createCompetency {
  @IsString()
  @IsNotEmpty()
  competency: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsString()
  client_id: string | null

  @IsOptional()
  @IsString()
  ref_nbol_id: string | null

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createExpectedBehaviour)
  expected_behaviours: createExpectedBehaviour[];
}
