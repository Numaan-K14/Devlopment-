import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { createExpectedBehaviour } from 'src/Modules/competencies/dto/create_expected_behaviour.dto';

export class updateCompetency {
  @IsString()
  @IsNotEmpty()
  competency: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createExpectedBehaviour)
  expected_behaviours: createExpectedBehaviour[];
}
