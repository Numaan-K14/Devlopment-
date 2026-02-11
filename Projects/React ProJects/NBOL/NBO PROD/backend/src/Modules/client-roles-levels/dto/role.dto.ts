import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class CreateRole {
  @IsString()
  client_id: string;

  @IsString()
  nbol_id: string;

  @IsArray()
//   roles: string[];
  roles: { role: string }[];
}
